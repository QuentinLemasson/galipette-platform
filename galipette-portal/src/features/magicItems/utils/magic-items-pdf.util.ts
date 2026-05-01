/**
 * @fileOverview Magic-items export: paints the SVG card template on a canvas
 * and overlays each item's name, type and description, then assembles the
 * results into a landscape A4 PDF (4 x 2 cards per page).
 *
 * The SVG template defines the visual frame (title band, image slot,
 * description panel). Slot coordinates are expressed in the SVG viewBox and
 * scaled to the card box at draw time.
 *
 * Single-card and multi-card rendering share the same drawing pipeline, so
 * the in-app preview and the printed PDF stay perfectly consistent.
 */
import { jsPDF } from 'jspdf';
import type { MagicItemResponseDto } from '@galipette/shared';

import cardTemplateUrl from '@/assets/magic-items/card-template.svg';

/* ------------------------------------------------------------------------------------------------
 * Page / grid constants (PDF points)
 * ------------------------------------------------------------------------------------------------ */

const PAGE_WIDTH_PT = 842;
const PAGE_HEIGHT_PT = 595;
const CAPTURE_SCALE = 2;

const GRID_COLS = 4;
const GRID_ROWS = 2;
const GRID_OUTER_PAD = 12;
const GRID_GAP = 8;

/** Cards per landscape A4 page (4 x 2 grid). */
export const CARDS_PER_PAGE = GRID_COLS * GRID_ROWS;

/* ------------------------------------------------------------------------------------------------
 * SVG template slot coordinates (viewBox 0 0 200 280)
 * ------------------------------------------------------------------------------------------------ */

const TEMPLATE_VIEWBOX_W = 200;
const TEMPLATE_VIEWBOX_H = 280;

const SLOT_TITLE = { x: 14, y: 14, w: 172, h: 26 };
const SLOT_TYPE = { x: 14, y: 44, w: 80, h: 14 };
const SLOT_IMAGE = { x: 20, y: 66, w: 160, h: 110 };
const SLOT_DESC = { x: 14, y: 184, w: 172, h: 82 };

/* ------------------------------------------------------------------------------------------------
 * Typography constants
 * ------------------------------------------------------------------------------------------------ */

const TITLE_FONT = "700 13px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const TITLE_COLOR = '#0f172a';

const TYPE_FONT = "600 9px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const TYPE_COLOR = '#475569';

const DESC_FONT = "500 9px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const DESC_COLOR = '#1e293b';
const DESC_PADDING_X = 8;
const DESC_PADDING_Y = 7;
const DESC_LINE_HEIGHT = 11.5;

const PLACEHOLDER_FONT =
  "600 10px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const PLACEHOLDER_COLOR = '#94a3b8';

/* ------------------------------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------------------------------ */

type CardBox = { x: number; y: number; w: number; h: number };

/** Subset of MagicItem fields required to render a card. */
export type MagicItemCardSource = Pick<
  MagicItemResponseDto,
  'id' | 'name' | 'description'
> & {
  type: { name: string };
  image?: string | null;
};

/* ------------------------------------------------------------------------------------------------
 * Image loading
 * ------------------------------------------------------------------------------------------------ */

let cardTemplatePromise: Promise<HTMLImageElement> | null = null;

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });

const loadCardTemplate = (): Promise<HTMLImageElement> => {
  if (!cardTemplatePromise) {
    cardTemplatePromise = loadImage(cardTemplateUrl);
  }
  return cardTemplatePromise;
};

const safeLoadItemImage = async (
  url: string | null | undefined
): Promise<HTMLImageElement | null> => {
  if (!url) return null;
  try {
    return await loadImage(url);
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------------------------------------
 * Canvas helpers
 * ------------------------------------------------------------------------------------------------ */

type Word = { text: string; isSpace: boolean };

const splitWords = (text: string): Word[] => {
  const parts = text.split(/(\s+)/);
  const words: Word[] = [];
  for (const part of parts) {
    if (!part) continue;
    words.push({ text: part, isSpace: /^\s+$/.test(part) });
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

    if (word.isSpace && current.length === 0) continue;

    const wordWidth = ctx.measureText(word.text).width;

    if (currentWidth + wordWidth > maxWidth && current.length > 0) {
      finishLine();
      if (maxLines !== undefined && lines.length >= maxLines) {
        truncated = true;
        break;
      }
      if (word.isSpace) continue;
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
  lineHeight: number
): void => {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    let cursorX = x;
    for (const word of line) {
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
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (
    truncated.length > 1 &&
    ctx.measureText(`${truncated}…`).width > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated.trimEnd()}…`;
};

/* ------------------------------------------------------------------------------------------------
 * Layout helpers
 * ------------------------------------------------------------------------------------------------ */

const computeCardBoxes = (): CardBox[] => {
  const cardWidth =
    (PAGE_WIDTH_PT - 2 * GRID_OUTER_PAD - (GRID_COLS - 1) * GRID_GAP) /
    GRID_COLS;
  const cardHeight =
    (PAGE_HEIGHT_PT - 2 * GRID_OUTER_PAD - (GRID_ROWS - 1) * GRID_GAP) /
    GRID_ROWS;

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

/** Project a slot from SVG viewBox space onto the absolute card position. */
const projectSlot = (
  box: CardBox,
  slot: { x: number; y: number; w: number; h: number }
): CardBox => {
  const scaleX = box.w / TEMPLATE_VIEWBOX_W;
  const scaleY = box.h / TEMPLATE_VIEWBOX_H;
  return {
    x: box.x + slot.x * scaleX,
    y: box.y + slot.y * scaleY,
    w: slot.w * scaleX,
    h: slot.h * scaleY,
  };
};

/* ------------------------------------------------------------------------------------------------
 * Drawing
 * ------------------------------------------------------------------------------------------------ */

const drawTemplateFrame = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  template: HTMLImageElement
): void => {
  ctx.drawImage(template, box.x, box.y, box.w, box.h);
};

const drawTitle = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  name: string
): void => {
  const slot = projectSlot(box, SLOT_TITLE);
  ctx.save();
  ctx.fillStyle = TITLE_COLOR;
  ctx.font = TITLE_FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const text = fitTextWithEllipsis(ctx, name, slot.w - 12);
  ctx.fillText(text, slot.x + slot.w / 2, slot.y + slot.h / 2 + 1);
  ctx.restore();
};

const drawTypeBadge = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  typeName: string
): void => {
  const slot = projectSlot(box, SLOT_TYPE);
  ctx.save();
  ctx.fillStyle = TYPE_COLOR;
  ctx.font = TYPE_FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const text = fitTextWithEllipsis(ctx, typeName, slot.w - 8);
  ctx.fillText(text, slot.x + slot.w / 2, slot.y + slot.h / 2 + 1);
  ctx.restore();
};

const drawItemImageOrPlaceholder = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  itemImage: HTMLImageElement | null
): void => {
  const slot = projectSlot(box, SLOT_IMAGE);
  ctx.save();
  if (itemImage) {
    const imgRatio = itemImage.width / itemImage.height;
    const slotRatio = slot.w / slot.h;
    let drawW = slot.w;
    let drawH = slot.h;
    if (imgRatio > slotRatio) {
      drawH = slot.w / imgRatio;
    } else {
      drawW = slot.h * imgRatio;
    }
    const drawX = slot.x + (slot.w - drawW) / 2;
    const drawY = slot.y + (slot.h - drawH) / 2;
    ctx.drawImage(itemImage, drawX, drawY, drawW, drawH);
  } else {
    ctx.fillStyle = PLACEHOLDER_COLOR;
    ctx.font = PLACEHOLDER_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('image a venir', slot.x + slot.w / 2, slot.y + slot.h / 2);
  }
  ctx.restore();
};

const drawDescription = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  description: string
): void => {
  const slot = projectSlot(box, SLOT_DESC);
  const innerWidth = slot.w - 2 * DESC_PADDING_X;
  ctx.save();
  ctx.font = DESC_FONT;
  ctx.fillStyle = DESC_COLOR;
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';

  const maxLines = Math.max(
    1,
    Math.floor((slot.h - 2 * DESC_PADDING_Y) / DESC_LINE_HEIGHT)
  );
  const lines = wrapWords(
    ctx,
    splitWords(description),
    innerWidth,
    maxLines
  );
  const baselineY = slot.y + DESC_PADDING_Y + DESC_LINE_HEIGHT - 3;
  drawWrappedLines(
    ctx,
    lines,
    slot.x + DESC_PADDING_X,
    baselineY,
    DESC_LINE_HEIGHT
  );

  ctx.restore();
};

const drawCard = (
  ctx: CanvasRenderingContext2D,
  box: CardBox,
  item: MagicItemCardSource,
  template: HTMLImageElement,
  itemImage: HTMLImageElement | null
): void => {
  drawTemplateFrame(ctx, box, template);
  drawItemImageOrPlaceholder(ctx, box, itemImage);
  drawTitle(ctx, box, item.name);
  drawTypeBadge(ctx, box, item.type.name);
  drawDescription(ctx, box, item.description);
};

/* ------------------------------------------------------------------------------------------------
 * Canvas construction
 * ------------------------------------------------------------------------------------------------ */

const createCanvas = (
  widthPt: number,
  heightPt: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement('canvas');
  canvas.width = widthPt * CAPTURE_SCALE;
  canvas.height = heightPt * CAPTURE_SCALE;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }
  ctx.scale(CAPTURE_SCALE, CAPTURE_SCALE);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.textBaseline = 'alphabetic';
  ctx.clearRect(0, 0, widthPt, heightPt);

  return { canvas, ctx };
};

const buildPageCanvas = async (
  items: readonly MagicItemCardSource[]
): Promise<HTMLCanvasElement> => {
  const template = await loadCardTemplate();
  const itemImages = await Promise.all(
    items.map(item => safeLoadItemImage(item.image ?? undefined))
  );

  const { canvas, ctx } = createCanvas(PAGE_WIDTH_PT, PAGE_HEIGHT_PT);
  const boxes = computeCardBoxes();
  const cardCount = Math.min(boxes.length, items.length);

  for (let i = 0; i < cardCount; i += 1) {
    drawCard(ctx, boxes[i], items[i], template, itemImages[i]);
  }

  return canvas;
};

/* ------------------------------------------------------------------------------------------------
 * Public API
 * ------------------------------------------------------------------------------------------------ */

/**
 * Renders the first export page as a PNG data URL (used by the export dialog).
 */
export const getMagicItemsPdfPreviewDataUrl = async (options: {
  items: readonly MagicItemCardSource[];
}): Promise<string | null> => {
  const { items } = options;
  if (items.length === 0) return null;

  const firstPage = items.slice(0, CARDS_PER_PAGE);
  const canvas = await buildPageCanvas(firstPage);
  return canvas.toDataURL('image/png');
};

/**
 * Renders a single magic item card centered on a small canvas, useful for the
 * details page or a "preview" dialog.
 */
export const getMagicItemCardPreviewDataUrl = async (options: {
  item: MagicItemCardSource;
}): Promise<string> => {
  const { item } = options;
  const template = await loadCardTemplate();
  const itemImage = await safeLoadItemImage(item.image ?? undefined);

  const card: CardBox = {
    x: 0,
    y: 0,
    w: TEMPLATE_VIEWBOX_W,
    h: TEMPLATE_VIEWBOX_H,
  };
  const { canvas, ctx } = createCanvas(TEMPLATE_VIEWBOX_W, TEMPLATE_VIEWBOX_H);
  drawCard(ctx, card, item, template, itemImage);
  return canvas.toDataURL('image/png');
};

/**
 * Saves a landscape A4 PDF with `CARDS_PER_PAGE` slots per sheet.
 * Items beyond the first page overflow onto additional pages.
 */
export const downloadMagicItemsLandscapePdf = async (options: {
  items: readonly MagicItemCardSource[];
  fileName?: string;
}): Promise<void> => {
  const { items } = options;
  if (items.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
    compress: true,
  });

  const pageCount = Math.ceil(items.length / CARDS_PER_PAGE);
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    if (pageIndex > 0) {
      pdf.addPage('a4', 'landscape');
    }
    const start = pageIndex * CARDS_PER_PAGE;
    const slice = items.slice(start, start + CARDS_PER_PAGE);
    const canvas = await buildPageCanvas(slice);
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
    `magic-items-export-${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(name.endsWith('.pdf') ? name : `${name}.pdf`);
};
