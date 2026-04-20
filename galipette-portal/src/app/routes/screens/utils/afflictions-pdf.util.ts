/**
 * @fileOverview Affliction export: HTML layout + classic CSS, canvas capture, landscape PDF.
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import type { DamageTypeBySlug } from '../data/damage-types';
import afflictionsPdfStyles from './afflictions-pdf.css?raw';

const DAMAGE_VALUE_TOKEN_REGEX = /damage:([a-z0-9-]+):(X|\d+)/gi;
const DAMAGE_TAG_PREFIX = 'damage:';

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

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const segmentsToHtml = (segments: DescriptionSegment[]): string =>
  segments
    .map(segment =>
      segment.color
        ? `<span class="apdf-damage" style="color:${escapeHtml(segment.color)}">${escapeHtml(segment.text)}</span>`
        : escapeHtml(segment.text)
    )
    .join('');

const getTagColor = (tag: string, damageTypeBySlug: DamageTypeBySlug): string => {
  if (!tag.startsWith(DAMAGE_TAG_PREFIX)) {
    return '#64748b';
  }
  const damageSlug = tag.slice(DAMAGE_TAG_PREFIX.length);
  return damageTypeBySlug[damageSlug]?.color ?? '#64748b';
};

const getTagLabel = (tag: string, damageTypeBySlug: DamageTypeBySlug): string =>
  tag.startsWith(DAMAGE_TAG_PREFIX)
    ? `degats:${(
        damageTypeBySlug[tag.slice(DAMAGE_TAG_PREFIX.length)]?.name ?? tag
      ).toLowerCase()}`
    : tag;

type PdfImageFormat = 'PNG' | 'JPEG' | 'WEBP';

type PdfImage = {
  dataUrl: string;
  format: PdfImageFormat;
};

const MIME_TO_PDF_FORMAT: Partial<Record<string, PdfImageFormat>> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/jpg': 'JPEG',
  'image/pjpeg': 'JPEG',
  'image/webp': 'WEBP',
};

const resolveImageUrl = (imagePath: string): string =>
  imagePath.startsWith('http')
    ? imagePath
    : `${window.location.origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Invalid FileReader result'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });

const sniffPdfImageFormat = async (blob: Blob): Promise<PdfImageFormat | null> => {
  const head = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) {
    return 'PNG';
  }
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    return 'JPEG';
  }
  if (
    head[0] === 0x52 &&
    head[1] === 0x49 &&
    head[2] === 0x46 &&
    head[3] === 0x46 &&
    head[8] === 0x57 &&
    head[9] === 0x45 &&
    head[10] === 0x42 &&
    head[11] === 0x50
  ) {
    return 'WEBP';
  }
  return null;
};

const rasterizeImageDataUrlToPng = (dataUrl: string): Promise<string | null> =>
  new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(null);
          return;
        }
        context.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });

const loadImageForPdf = async (imagePath: string): Promise<PdfImage | null> => {
  try {
    const response = await fetch(resolveImageUrl(imagePath));
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const mime = blob.type.split(';')[0].trim().toLowerCase();

    if (
      mime === 'text/html' ||
      mime === 'application/json' ||
      mime === 'text/plain'
    ) {
      return null;
    }

    let format: PdfImageFormat | null = MIME_TO_PDF_FORMAT[mime] ?? null;
    if (!format) {
      format = await sniffPdfImageFormat(blob);
    }

    let dataUrl = await blobToDataUrl(blob);

    if (!format && mime.startsWith('image/')) {
      const pngDataUrl = await rasterizeImageDataUrlToPng(dataUrl);
      if (!pngDataUrl) {
        return null;
      }
      dataUrl = pngDataUrl;
      format = 'PNG';
    }

    if (!format) {
      return null;
    }

    return { dataUrl, format };
  } catch {
    return null;
  }
};

const normalizePdfImage = async (loaded: PdfImage): Promise<PdfImage> => {
  try {
    const probe = new jsPDF({ unit: 'pt', format: [24, 24] });
    probe.addImage(loaded.dataUrl, loaded.format, 0, 0, 12, 12, undefined, 'FAST');
    return loaded;
  } catch {
    const pngDataUrl = await rasterizeImageDataUrlToPng(loaded.dataUrl);
    return pngDataUrl ? { dataUrl: pngDataUrl, format: 'PNG' } : loaded;
  }
};

const preloadAfflictionImages = async (
  afflictions: readonly AfflictionPdfSource[]
): Promise<Map<string, string | null>> => {
  const map = new Map<string, string | null>();
  const paths = [...new Set(afflictions.map(a => a.image))];

  for (const path of paths) {
    const loaded = await loadImageForPdf(path);
    if (!loaded) {
      map.set(path, null);
    } else {
      const normalized = await normalizePdfImage(loaded);
      map.set(path, normalized.dataUrl);
    }
  }

  return map;
};

const buildAfflictionCardHtml = (
  affliction: AfflictionPdfSource,
  imageDataUrl: string | null,
  damageTypeBySlug: DamageTypeBySlug
): string => {
  const effectHtml = segmentsToHtml(
    parseDamageDescription(affliction.effectDescription, damageTypeBySlug)
  );
  const healingHtml = segmentsToHtml(
    parseDamageDescription(affliction.healingDescription, damageTypeBySlug)
  );

  const mediaInner = imageDataUrl
    ? `<img class="apdf-card__img" src="${imageDataUrl.replace(/"/g, '&quot;')}" alt="" />`
    : `<div class="apdf-card__placeholder" aria-hidden="true">${escapeHtml(
        affliction.name.slice(0, 1).toUpperCase()
      )}</div>`;

  const tagsHtml = affliction.tags
    .map(tag => {
      const label = escapeHtml(getTagLabel(tag, damageTypeBySlug));
      const color = escapeHtml(getTagColor(tag, damageTypeBySlug));
      const isDamage = tag.startsWith(DAMAGE_TAG_PREFIX);
      const cls = isDamage ? 'apdf-tag apdf-tag--damage' : 'apdf-tag';
      const style = isDamage
        ? `border-color:${color};color:${color};`
        : 'border-color:#cbd5e1;color:#475569;';
      return `<span class="${cls}" style="${style}">${label}</span>`;
    })
    .join('');

  return `
<article class="apdf-card">
  <div class="apdf-card__banner">
    <div class="apdf-card__media">${mediaInner}</div>
    <div class="apdf-card__title-wrap">
      <h2 class="apdf-card__name">${escapeHtml(affliction.name)}</h2>
    </div>
  </div>
  <div class="apdf-card__body">
    <div class="apdf-card__tags">${tagsHtml}</div>
    <p class="apdf-card__desc">${effectHtml}</p>
    <hr class="apdf-card__divider" />
    <p class="apdf-card__desc apdf-card__desc--muted">${healingHtml}</p>
  </div>
</article>`.trim();
};

/** Fixed capture size (px), must match `.apdf-root` in afflictions-pdf.css */
export const AFFLICTIONS_PDF_CAPTURE_WIDTH = 850;
export const AFFLICTIONS_PDF_CAPTURE_HEIGHT = 600;

const buildExportRootHtml = (
  afflictions: readonly AfflictionPdfSource[],
  imageMap: Map<string, string | null>,
  damageTypeBySlug: DamageTypeBySlug
): string => {
  const cards = afflictions
    .map(a =>
      buildAfflictionCardHtml(a, imageMap.get(a.image) ?? null, damageTypeBySlug)
    )
    .join('\n');

  return `<div class="apdf-root"><div class="apdf-grid">${cards}</div></div>`.trim();
};

/** Escape accidental `</style>` sequences inside CSS text when embedding in srcdoc. */
const escapeStyleForSrcDoc = (css: string): string =>
  css.replace(/<\/style/gi, '<\\/style');

const buildIframeSrcDoc = (
  afflictions: readonly AfflictionPdfSource[],
  imageMap: Map<string, string | null>,
  damageTypeBySlug: DamageTypeBySlug
): string => {
  const styleBlock = escapeStyleForSrcDoc(afflictionsPdfStyles);
  const bodyInner = buildExportRootHtml(afflictions, imageMap, damageTypeBySlug);
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><style>${styleBlock}</style></head><body style="margin:0;background-color:#f1f5f9;">${bodyInner}</body></html>`;
};

/**
 * Full iframe `srcdoc` for the export layout (same document as PDF capture). Used for modal preview.
 */
export const getAfflictionsPdfPreviewSrcDoc = async (options: {
  afflictions: readonly AfflictionPdfSource[];
  damageTypeBySlug: DamageTypeBySlug;
}): Promise<string> => {
  const { afflictions, damageTypeBySlug } = options;
  if (afflictions.length === 0) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/></head><body style="margin:0;background-color:#f1f5f9;"></body></html>`;
  }
  const imageMap = await preloadAfflictionImages(afflictions);
  return buildIframeSrcDoc(afflictions, imageMap, damageTypeBySlug);
};

/**
 * Renders afflictions as styled HTML (classic CSS), captures to canvas, saves a single landscape PDF.
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

  const imageMap = await preloadAfflictionImages(afflictions);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', 'afflictions-pdf-capture');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = `position:fixed;left:-12000px;top:0;width:${AFFLICTIONS_PDF_CAPTURE_WIDTH}px;height:${AFFLICTIONS_PDF_CAPTURE_HEIGHT + 80}px;border:0;opacity:0;pointer-events:none;`;

  const srcDoc = buildIframeSrcDoc(afflictions, imageMap, damageTypeBySlug);

  /**
   * Assign `srcdoc` before inserting the iframe so the first `load` event is for our document.
   * If the iframe is appended empty, some browsers fire `load` for `about:blank` and we would
   * resolve before `srcdoc` is applied — then `.apdf-root` is missing.
   */
  iframe.srcdoc = srcDoc;

  try {
    await new Promise<void>((resolve, reject) => {
      const onLoad = (): void => {
        iframe.removeEventListener('load', onLoad);
        resolve();
      };
      iframe.addEventListener('load', onLoad);
      iframe.addEventListener(
        'error',
        () => {
          reject(new Error('PDF iframe failed to load'));
        },
        { once: true }
      );
      document.body.appendChild(iframe);
    });

    const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    const captureTarget = (iframeDoc?.querySelector('.apdf-root') ?? null) as HTMLElement | null;
    if (!captureTarget) {
      throw new Error(
        `PDF capture root missing (body children: ${iframeDoc?.body?.childElementCount ?? 'n/a'})`
      );
    }

    await new Promise<void>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const canvas = await html2canvas(captureTarget, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f1f5f9',
      logging: false,
      foreignObjectRendering: false,
      width: AFFLICTIONS_PDF_CAPTURE_WIDTH,
      height: AFFLICTIONS_PDF_CAPTURE_HEIGHT,
      windowWidth: AFFLICTIONS_PDF_CAPTURE_WIDTH,
      windowHeight: AFFLICTIONS_PDF_CAPTURE_HEIGHT,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    /** A4 landscape in pt (width × height). */
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = Math.min(pageWidth / imgW, pageHeight / imgH);
    const renderW = imgW * ratio;
    const renderH = imgH * ratio;
    const offsetX = (pageWidth - renderW) / 2;
    const offsetY = (pageHeight - renderH) / 2;

    pdf.addImage(imgData, 'PNG', offsetX, offsetY, renderW, renderH, undefined, 'FAST');

    const name =
      options.fileName ??
      `afflictions-export-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(name.endsWith('.pdf') ? name : `${name}.pdf`);
  } finally {
    iframe.remove();
  }
};
