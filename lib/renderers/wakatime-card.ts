import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml } from '../utils';

export interface WakaTimeData {
  humanReadableTotal?: string;
  dailyAverage?: string;
  languages?: Array<{ name: string; percent: number; text: string }>;
  editors?: Array<{ name: string; percent: number; text: string }>;
  operatingSystems?: Array<{ name: string; percent: number; text: string }>;
  isMock?: boolean;
}

export interface WakaTimeCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
  custom_title?: string;
}

export function renderWakaTimeCard(
  username: string,
  data: WakaTimeData,
  options: WakaTimeCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const width = 495;
  const height = 195;
  const title = escapeXml(options.custom_title || `WakaTime Coding Activity`);

  const totalTime = data.humanReadableTotal || '28 hrs 45 mins';
  const dailyAvg = data.dailyAverage || '4 hrs 06 mins';
  const topLangs = data.languages || [
    { name: 'TypeScript', percent: 45.2, text: '13 hrs' },
    { name: 'Python', percent: 28.6, text: '8 hrs 15 mins' },
    { name: 'Rust', percent: 16.4, text: '4 hrs 40 mins' },
    { name: 'Other', percent: 9.8, text: '2 hrs 50 mins' },
  ];

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg-grad-waka" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .card-bg { fill: url(#bg-grad-waka); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .time-label { font: 400 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .time-val { font: 700 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .item-name { font: 600 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .item-time { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Title with Clock Icon -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.25a.75.75 0 0 1 .75.75v3.19l2.22 1.33a.75.75 0 1 1-.77 1.28l-2.5-1.5A.75.75 0 0 1 7.25 9V5.5A.75.75 0 0 1 8 4.75Z"/>
    </svg>
    <text x="26" y="0" class="header">${title}</text>
  </g>

  <!-- Top Overview: Total Time & Daily Average -->
  <g transform="translate(25, 52)">
    <g transform="translate(0, 0)">
      <text x="0" y="14" class="time-val">${totalTime}</text>
      <text x="0" y="30" class="time-label">Total Time (Last 7 Days)</text>
    </g>
    <g transform="translate(225, 0)">
      <text x="0" y="14" class="time-val">${dailyAvg}</text>
      <text x="0" y="30" class="time-label">Daily Average</text>
    </g>
  </g>

  <!-- Language Breakdown Bars -->
  <g transform="translate(25, 100)">
    ${topLangs
      .slice(0, 4)
      .map((item, idx) => {
        const y = idx * 22;
        const barW = Math.max((item.percent / 100) * 190, 4);
        return `
    <g transform="translate(0, ${y})">
      <text x="0" y="10" class="item-name">${escapeXml(item.name)}</text>
      <rect x="100" y="3" width="190" height="7" rx="3.5" fill="${theme.cardBg || '#161b22'}" stroke="${theme.border}" stroke-width="0.5" />
      <rect x="100" y="3" width="${barW}" height="7" rx="3.5" fill="${theme.accent || '#38bdf8'}" />
      <text x="305" y="10" class="item-time">${escapeXml(item.text)} (${item.percent.toFixed(0)}%)</text>
    </g>`;
      })
      .join('')}
  </g>
</svg>
`.trim();
}
