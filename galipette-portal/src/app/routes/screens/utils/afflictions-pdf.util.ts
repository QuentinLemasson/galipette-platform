/**
 * @fileOverview Affliction export: draws landscape A4 canvases directly (no HTML/CSS),
 * then embeds them in jsPDF (one page per 8 cards; extra cards continue on following pages).
 *
 * Print-friendly: no ink-heavy fills — transparent page, cards and panels drawn with borders only.
 *
 * Card layout:
 * - Card outline (rounded rect stroke).
 * - Title bar at top: border only, dark text.
 * - Centered "image a venir" placeholder text.
 * - Description panel at bottom: border only, auto height from line count.
 */
import { jsPDF } from 'jspdf';

import type { DamageTypeBySlug } from '../data/damage-types';

/* ------------------------------------------------------------------------------------------------
 * Types & damage-token parser (shared with the on-page renderer)
 * ------------------------------------------------------------------------------------------------ */

const DAMAGE_VALUE_TOKEN_REGEX = /damage:([a-z0-9-]+):(X|\d+)/gi;

export type AfflictionPdfSource = {
  id: number;
  name: string;
  effectDescription: string;
  healingDescription: string;
  tags: string[];
  image: string;
};

export type DescriptionSegment = {
  text: string;
  color?: string;
};

export const parseDamageDescription = (
  description: string,
  damageTypeBySlug: DamageTypeBySlug
): DescriptionSegment[] => {
  const regex = new RegExp(DAMAGE_VALUE_TOKEN_REGEX);
  const segments: DescriptionSegment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null = regex.exec(description);

  while (match) {
    const [fullMatch, damageSlug, value] = match;
    const matchStart = match.index;

    if (matchStart > cursor) {
      segments.push({ text: description.slice(cursor, matchStart) });
    }

    const damageType = damageTypeBySlug[damageSlug];
    if (!damageType) {
      segments.push({ text: fullMatch });
    } else {
      segments.push({
        text: `${value} degats de ${damageType.name.toLowerCase()}`,
        color: damageType.color,
      });
    }

    cursor = matchStart + fullMatch.length;
    match = regex.exec(description);
  }

  if (cursor < description.length) {
    segments.push({ text: description.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ text: description }];
};

/* ------------------------------------------------------------------------------------------------
 * Page / grid / card layout constants (in PDF points)
 * ------------------------------------------------------------------------------------------------ */

const PAGE_WIDTH_PT = 842;
const PAGE_HEIGHT_PT = 595;
const CAPTURE_SCALE = 2;

const GRID_COLS = 4;
const GRID_ROWS = 2;
const GRID_OUTER_PAD = 12;
const GRID_GAP = 8;

/** Cards per landscape A4 page (4 columns × 2 rows). */
export const CARDS_PER_PAGE = GRID_COLS * GRID_ROWS;

const CARD_RADIUS = 10;
const FLOATING_INSET = 10;

/** Stroke-only styling for print (minimal ink). */
const STROKE_CARD = '#64748b';
const STROKE_INNER = '#94a3b8';
const STROKE_WIDTH = 1;

const TITLE_HEIGHT = 32;
const TITLE_RADIUS = 8;
const TITLE_COLOR = '#0f172a';
const TITLE_FONT = "700 13px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const DESC_RADIUS = 8;
const DESC_EFFECT_COLOR = '#1e293b';
const DESC_HEALING_COLOR = '#64748b';
const DESC_FONT = "500 9px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const DESC_PADDING_X = 10;
const DESC_PADDING_Y = 7;
const DESC_LINE_HEIGHT = 11.5;
const DESC_SECTION_GAP = 4;

const PLACEHOLDER_FONT =
  "600 10px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const PLACEHOLDER_COLOR = '#64748b';

/* ------------------------------------------------------------------------------------------------
 * Canvas helpers
 * ------------------------------------------------------------------------------------------------ */

type CardBox = { x: number; y: number; w: number; h: number };

type Word = { text: string; color?: string; isSpace: boolean };

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void => {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
};

const segmentsToWords = (segments: DescriptionSegment[]): Word[] => {
  const words: Word[] = [];
  for (const segment of segments) {
    const parts = segment.text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      words.push({
        text: part,
        color: segment.color,
        isSpace: /^\s+$/.test(part),
      });
    }
  }
  return words;
};

const wrapWords = (
  ctx: CanvasRenderingContext2D,
  words: Word[],
  maxWidth: number,
  maxLines?: number
): Word[][] => {
  const lines: Word[][] = [];
  let current: Word[] = [];
  let currentWidth = 0;
  let truncated = false;

  const finishLine = (): void => {
    while (current.length > 0 && current[current.length - 1].isSpace) {
      current.pop();
    }
    if (current.length > 0) {
      lines.push(current);
    }
    current = [];
    currentWidth = 0;
  };

  for (const word of words) {
    if (maxLines !== undefined && lines.length >= maxLines) {
      truncated = true;
      break;
    }

    if (word.isSpace && current.length === 0) {
      continue;
    }

    const wordWidth = ctx.measureText(word.text).width;

    if (currentWidth + wordWidth > maxWidth && current.length > 0) {
      finishLine();
      if (maxLines !== undefined && lines.length >= maxLines) {
        truncated = true;
        break;
      }
      if (word.isSpace) {
        continue;
      }
    }

    current.push(word);
    currentWidth += wordWidth;
  }

  if (current.length > 0) {
    if (maxLines === undefined || lines.length < maxLines) {
      finishLine();
    } else {
      truncated = true;
    }
  }

  if (truncated && lines.length > 0) {
    const ellipsis: Word = { text: '…', isSpace: false };
    const lastLine = lines[lines.length - 1];
    const ellipsisWidth = ctx.measureText(ellipsis.text).width;
    let lineWidth = lastLine.reduce(
      (sum, word) => sum + ctx.measureText(word.text).width,
      0
    );
    while (lastLine.length > 0 && lineWidth + ellipsisWidth > maxWidth) {
      const popped = lastLine.pop();
      if (!popped) break;
      lineWidth -= ctx.measureText(popped.text).width;
    }
    while (lastLine.length > 0 && lastLine[lastLine.length - 1].isSpace) {
      lastLine.pop();
    }
    lastLine.push(ellipsis);
  }

  return lines;
};

const drawWrappedLines = (
  ctx: CanvasRenderingContext2D,
  lines: Word[][],
  x: number,
  baselineY: number,
  lineHeight: number,
  defaultColor: string
): void => {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    let cursorX = x;
    for (const word of line) {
      ctx.fillStyle = word.color ?? defaultColor;
      ctx.fillText(word.text, cursorX, baselineY + i * lineHeight);
      cursorX += ctx.measureText(word.text).width;
    }
  }
};

const fitTextWithEllipsis = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string => {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }
  let truncated = text;
  while (
    truncated.length > 1 &&
    ctx.measureText(`${truncated}…`).width > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated.trimEnd()}…`;
};

const computeCardBoxes = (): CardBox[] => {
  const cardWidth =
    (PAGE_WIDTH_PT - 2 * GRID_OUTER_PAD - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS;
  const cardHeight =
    (PAGE_HEIGHT_PT - 2 * GRID_OUTER_PAD - (GRID_ROWS - 1) * GRID_GAP) / GRID_ROWS;

  const boxes: CardBox[] = [];
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      boxes.push({
        x: GRID_OUTER_PAD + col * (cardWidth + GRID_GAP),
        y: GRID_OUTER_PAD + row * (cardHeight + GRID_GAP),
        w: cardWidth,
        h: cardHeight,
      });
    }
  }
  return boxes;
};

/* ------------------------------------------------------------------------------------------------
 * Card drawing
 * ------------------------------------------------------------------------------------------------ */

const drawCardOutline = (
  ctx: CanvasRenderingContext2D,
  box: CardBox
): void => {
  const { x, y, w, h } = box;

  ctx.save();
  ctx.strokeStyle = STROKE_CARD;
  ctx.lineWidth = STROKE_WIDTH;
  drawRoundedRect(ctx, x + STROKE_WIDTH / 2, y + STROKE_WIDTH / 2, w - STROKE_WIDTH, h - STROKE_WIDTH, CARD_RADIUS);
  ctx.stroke();
  ctx.restore();
};

const drawCardImagePlaceholder = (
  ctx: CanvasRenderingContext2D,
  box: CardBox
): void => {
  const { x, y, w, h } = box;

  ctx.save();
  const inset = 12;
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = STROKE_INNER;
  ctx.lineWidth = STROKE_WIDTH;
  drawRoundedRect(
    ctx,
    x + inset + STROKE_WIDTH / 2,
    y + inset + STROKE_WIDTH / 2,
    w - 2 * inset - STROKE_WIDTH,
    h - 2 * inset - STROKE_WIDTH,
    6
  );
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = PLACEHOLDER_COLOR;
  ctx.font = PLACEHOLDER_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('image a venir', x + w / 2, y + h / 2);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
};

const drawFloatingTitle = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  name: string
): void => {
  const titleX = box.x + FLOATING_INSET;
  const titleY = box.y + FLOATING_INSET;
  const titleW = box.w - 2 * FLOATING_INSET;

  ctx.save();
  ctx.strokeStyle = STROKE_CARD;
  ctx.lineWidth = STROKE_WIDTH;
  drawRoundedRect(
    ctx,
    titleX + STROKE_WIDTH / 2,
    titleY + STROKE_WIDTH / 2,
    titleW - STROKE_WIDTH,
    TITLE_HEIGHT - STROKE_WIDTH,
    TITLE_RADIUS
  );
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = TITLE_COLOR;
  ctx.font = TITLE_FONT;
  ctx.textBaseline = 'middle';
  const paddingX = 9;
  const text = fitTextWithEllipsis(ctx, name, titleW - 2 * paddingX);
  ctx.fillText(text, titleX + paddingX, titleY + TITLE_HEIGHT / 2 + 1);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
};

const drawFloatingDescriptions = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  affliction: AfflictionPdfSource,
  damageTypeBySlug: DamageTypeBySlug
): void => {
  const boxX = box.x + FLOATING_INSET;
  const boxW = box.w - 2 * FLOATING_INSET;
  const innerMaxWidth = boxW - 2 * DESC_PADDING_X;

  ctx.save();
  ctx.font = DESC_FONT;

  const spaceAboveDescriptions =
    FLOATING_INSET + TITLE_HEIGHT + 6 + FLOATING_INSET;
  const availableHeight = box.h - spaceAboveDescriptions;
  const maxTotalLines = Math.max(
    2,
    Math.floor(
      (availableHeight - 2 * DESC_PADDING_Y - DESC_SECTION_GAP) / DESC_LINE_HEIGHT
    )
  );
  const maxEffectLines = Math.max(1, Math.ceil(maxTotalLines * 0.55));
  const maxHealingLines = Math.max(1, maxTotalLines - maxEffectLines);

  const effectLines = wrapWords(
    ctx,
    segmentsToWords(
      parseDamageDescription(affliction.effectDescription, damageTypeBySlug)
    ),
    innerMaxWidth,
    maxEffectLines
  );
  const healingLines = wrapWords(
    ctx,
    segmentsToWords(
      parseDamageDescription(affliction.healingDescription, damageTypeBySlug)
    ),
    innerMaxWidth,
    maxHealingLines
  );

  const textHeight =
    effectLines.length * DESC_LINE_HEIGHT +
    (healingLines.length > 0 ? DESC_SECTION_GAP : 0) +
    healingLines.length * DESC_LINE_HEIGHT;
  const panelHeight = Math.max(24, textHeight + 2 * DESC_PADDING_Y);
  const panelY = box.y + box.h - FLOATING_INSET - panelHeight;

  ctx.strokeStyle = STROKE_INNER;
  ctx.lineWidth = STROKE_WIDTH;
  drawRoundedRect(
    ctx,
    boxX + STROKE_WIDTH / 2,
    panelY + STROKE_WIDTH / 2,
    boxW - STROKE_WIDTH,
    panelHeight - STROKE_WIDTH,
    DESC_RADIUS
  );
  ctx.stroke();

  let baselineY = panelY + DESC_PADDING_Y + DESC_LINE_HEIGHT - 3;
  drawWrappedLines(
    ctx,
    effectLines,
    boxX + DESC_PADDING_X,
    baselineY,
    DESC_LINE_HEIGHT,
    DESC_EFFECT_COLOR
  );
  baselineY += effectLines.length * DESC_LINE_HEIGHT + DESC_SECTION_GAP;
  drawWrappedLines(
    ctx,
    healingLines,
    boxX + DESC_PADDING_X,
    baselineY,
    DESC_LINE_HEIGHT,
    DESC_HEALING_COLOR
  );

  ctx.restore();
};

const drawCard = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  affliction: AfflictionPdfSource,
  damageTypeBySlug: DamageTypeBySlug
): void => {
  drawCardOutline(ctx, box);
  drawCardImagePlaceholder(ctx, box);
  drawFloatingTitle(ctx, box, affliction.name);
  drawFloatingDescriptions(ctx, box, affliction, damageTypeBySlug);
};

/* ------------------------------------------------------------------------------------------------
 * Canvas construction
 * ------------------------------------------------------------------------------------------------ */

const buildAfflictionsCanvas = (
  afflictions: readonly AfflictionPdfSource[],
  damageTypeBySlug: DamageTypeBySlug
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_WIDTH_PT * CAPTURE_SCALE;
  canvas.height = PAGE_HEIGHT_PT * CAPTURE_SCALE;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.scale(CAPTURE_SCALE, CAPTURE_SCALE);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.textBaseline = 'alphabetic';

  ctx.clearRect(0, 0, PAGE_WIDTH_PT, PAGE_HEIGHT_PT);

  const boxes = computeCardBoxes();
  const cardCount = Math.min(boxes.length, afflictions.length);
  for (let index = 0; index < cardCount; index += 1) {
    drawCard(ctx, boxes[index], afflictions[index], damageTypeBySlug);
  }

  return canvas;
};

/* ------------------------------------------------------------------------------------------------
 * Public API
 * ------------------------------------------------------------------------------------------------ */

/**
 * Builds the first export page as a PNG data URL for modal preview.
 * Further pages are only included when downloading the PDF.
 */
export const getAfflictionsPdfPreviewDataUrl = (options: {
  afflictions: readonly AfflictionPdfSource[];
  damageTypeBySlug: DamageTypeBySlug;
}): string | null => {
  const { afflictions, damageTypeBySlug } = options;
  if (afflictions.length === 0) {
    return null;
  }

  const firstPage = afflictions.slice(0, CARDS_PER_PAGE);
  const canvas = buildAfflictionsCanvas(firstPage, damageTypeBySlug);
  return canvas.toDataURL('image/png');
};

/**
 * Saves a landscape A4 PDF with `CARDS_PER_PAGE` slots per sheet; overflow adds pages.
 */
export const downloadAfflictionsLandscapePdf = async (options: {
  afflictions: readonly AfflictionPdfSource[];
  damageTypeBySlug: DamageTypeBySlug;
  fileName?: string;
}): Promise<void> => {
  const { afflictions, damageTypeBySlug } = options;
  if (afflictions.length === 0) {
    return;
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
    compress: true,
  });

  const pageCount = Math.ceil(afflictions.length / CARDS_PER_PAGE);
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    if (pageIndex > 0) {
      pdf.addPage('a4', 'landscape');
    }
    const start = pageIndex * CARDS_PER_PAGE;
    const slice = afflictions.slice(start, start + CARDS_PER_PAGE);
    const canvas = buildAfflictionsCanvas(slice, damageTypeBySlug);
    pdf.addImage(
      canvas,
      'PNG',
      0,
      0,
      PAGE_WIDTH_PT,
      PAGE_HEIGHT_PT,
      undefined,
      'FAST'
    );
  }

  const name =
    options.fileName ??
    `afflictions-export-${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(name.endsWith('.pdf') ? name : `${name}.pdf`);
};
