import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber } from '../utils';

export interface CounterCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  text_color?: string | null;
  label_color?: string | null;
  style?: 'flat' | 'flat-square' | 'for-the-badge' | 'cyberpunk' | 'pill' | 'odometer';
  label?: string;
  pad_zeros?: number;
}

export function renderProfileCounter(
  count: number,
  options: CounterCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const label = escapeXml(options.label || 'Profile Views');
  const style = options.style || 'flat';

  let displayCount = count.toLocaleString();
  if (options.pad_zeros && options.pad_zeros > 0) {
    displayCount = String(count).padStart(options.pad_zeros, '0');
  }

  if (style === 'pill') {
    const width = 65 + label.length * 6.5 + displayCount.length * 7.5;
    const height = 28;
    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}: ${displayCount}">
  <style>
    .label { font: 500 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; dominant-baseline: central; }
    .val { font: 700 12.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; dominant-baseline: central; }
  </style>
  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" rx="14" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.2" />
  <svg x="10" y="6" width="16" height="16" viewBox="0 0 16 16" fill="${theme.icon}">
    <path d="M1.5 8s3-5.5 6.5-5.5S14.5 8 14.5 8s-3 5.5-6.5 5.5S1.5 8 1.5 8Z"/>
    <circle cx="8" cy="8" r="2.5"/>
  </svg>
  <text x="32" y="14" class="label">${label}</text>
  <text x="${width - 12}" y="14" class="val" text-anchor="end">${displayCount}</text>
</svg>
`.trim();
  }

  if (style === 'cyberpunk' || style === 'odometer') {
    const digits = displayCount.split('');
    const digitWidth = 24;
    const digitHeight = 36;
    const totalDigitsWidth = digits.length * digitWidth;
    const width = Math.max(totalDigitsWidth + 60, 200);
    const height = 80;

    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}: ${displayCount}">
  <style>
    .label { font: 700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #00ffcc; text-anchor: middle; letter-spacing: 1.5px; }
    .digit-box { fill: #0d1117; stroke: #00ffcc; stroke-width: 1.5; rx: 4px; }
    .digit-text { font: 800 20px 'Courier New', monospace; fill: #00ffcc; text-anchor: middle; dominant-baseline: central; }
    .card-bg { fill: #050714; stroke: #00ffcc; stroke-width: 1.5; rx: 8px; }
  </style>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" class="card-bg" />
  <text x="${width / 2}" y="22" class="label">${label.toUpperCase()}</text>
  <g transform="translate(${(width - totalDigitsWidth) / 2}, 30)">
    ${digits
      .map(
        (d, i) => `
    <g transform="translate(${i * digitWidth}, 0)">
      <rect x="2" y="0" width="${digitWidth - 4}" height="${digitHeight}" class="digit-box" />
      <text x="${digitWidth / 2}" y="${digitHeight / 2}" class="digit-text">${d}</text>
    </g>`
      )
      .join('')}
  </g>
</svg>
`.trim();
  }

  // Default / Flat badge style
  const labelWidth = label.length * 6.5 + 16;
  const valWidth = displayCount.length * 7.5 + 16;
  const width = labelWidth + valWidth;
  const height = 24;
  const rx = style === 'flat-square' ? 0 : 4;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}: ${displayCount}">
  <style>
    .badge-label { font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #ffffff; text-anchor: middle; dominant-baseline: central; }
    .badge-val { font: 700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #ffffff; text-anchor: middle; dominant-baseline: central; }
  </style>
  <clipPath id="clip">
    <rect width="${width}" height="${height}" rx="${rx}" />
  </clipPath>
  <g clip-path="url(#clip)">
    <rect width="${labelWidth}" height="${height}" fill="#30363d" />
    <rect x="${labelWidth}" width="${valWidth}" height="${height}" fill="${theme.title || '#0969da'}" />
    <text x="${labelWidth / 2}" y="${height / 2 + 0.5}" class="badge-label">${label}</text>
    <text x="${labelWidth + valWidth / 2}" y="${height / 2 + 0.5}" class="badge-val">${displayCount}</text>
  </g>
</svg>
`.trim();
}
