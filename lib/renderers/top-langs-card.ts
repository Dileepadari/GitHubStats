import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber } from '../utils';

export interface TopLangsCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
  layout?: 'compact' | 'normal';
  langs_count?: number;
  hide?: string;
  custom_title?: string;
}

export function renderTopLangsCard(
  user: GitHubUserRawData,
  options: TopLangsCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const maxLangs = Math.min(Math.max(options.langs_count || 6, 1), 8);
  const hiddenLangs = (options.hide || '').split(',').map((s) => s.trim().toLowerCase());

  const filtered = user.languages
    .filter((l) => !hiddenLangs.includes(l.name.toLowerCase()))
    .slice(0, maxLangs);

  const sumBytes = filtered.reduce((acc, l) => acc + l.bytes, 0) || 1;
  const langs = filtered.map((l) => ({
    ...l,
    percent: (l.bytes / sumBytes) * 100,
  }));

  const width = 495;
  const height = 195;
  const barWidth = 445;
  const title = escapeXml(options.custom_title || 'Most Used Languages');

  // Compute segmented progress bar segments
  let currentX = 0;
  const barSegments = langs.map((l) => {
    const segWidth = (l.percent / 100) * barWidth;
    const x = currentX;
    currentX += segWidth;
    return {
      name: l.name,
      x,
      width: Math.max(segWidth, 2),
      color: l.color,
    };
  });

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg-grad-langs" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .lang-name { font: 600 12.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .lang-percent { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .card-bg { fill: url(#bg-grad-langs); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Title with Code Icon -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path fill-rule="evenodd" d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25Zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25Z"/>
    </svg>
    <text x="26" y="0" class="header">${title}</text>
  </g>

  <!-- Segmented Multi-Color Bar -->
  <g transform="translate(25, 48)">
    <mask id="bar-mask">
      <rect x="0" y="0" width="${barWidth}" height="10" rx="5" fill="#ffffff" />
    </mask>
    <g mask="url(#bar-mask)">
      ${barSegments
        .map(
          (seg) => `
      <rect x="${seg.x.toFixed(2)}" y="0" width="${seg.width.toFixed(2)}" height="10" fill="${seg.color}" />`
        )
        .join('')}
    </g>
  </g>

  <!-- Language Grid List (2 cols, 3 rows) -->
  <g transform="translate(25, 78)">
    ${langs
      .map((l, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = col * 225;
        const y = row * 32;

        return `
    <g transform="translate(${x}, ${y})">
      <circle cx="6" cy="6" r="5" fill="${l.color}" />
      <text x="18" y="10" class="lang-name">${escapeXml(l.name)}</text>
      <text x="140" y="10" class="lang-percent" text-anchor="end">${l.percent.toFixed(1)}%</text>
    </g>`;
      })
      .join('')}
  </g>
</svg>
`.trim();
}
