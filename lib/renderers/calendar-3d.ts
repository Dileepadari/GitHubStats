import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber } from '../utils';

export interface Calendar3DOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
  weeks?: number;
}

export function renderCalendar3D(
  user: GitHubUserRawData,
  options: Calendar3DOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const width = 640;
  const height = 260;

  const rawWeeks = user.calendarWeeks || [];
  const weeksToShow = rawWeeks.slice(-24);

  const originX = 185;
  const originY = 75;

  const levelColors: Record<number, { top: string; left: string; right: string }> = {
    0: { top: '#161b22', left: '#0d1117', right: '#090d13' },
    1: { top: '#0e4429', left: '#002914', right: '#001a0c' },
    2: { top: '#006d32', left: '#004a20', right: '#003316' },
    3: { top: '#26a641', left: '#1b782e', right: '#145c22' },
    4: { top: '#39d353', left: '#2db043', right: '#228c34' },
  };

  if (theme.accent && theme.accent !== '#238636') {
    levelColors[1] = { top: `${theme.accent}55`, left: `${theme.accent}33`, right: `${theme.accent}22` };
    levelColors[2] = { top: `${theme.accent}88`, left: `${theme.accent}66`, right: `${theme.accent}44` };
    levelColors[3] = { top: `${theme.accent}bb`, left: `${theme.accent}99`, right: `${theme.accent}77` };
    levelColors[4] = { top: theme.accent, left: `${theme.accent}cc`, right: `${theme.accent}aa` };
  }

  const cubes: string[] = [];

  weeksToShow.forEach((week, colIdx) => {
    (week.days || []).forEach((day, rowIdx) => {
      const level = Math.min(Math.max(day.level, 0), 4);
      const h = level === 0 ? 3 : level * 5 + 4;

      const x = originX + colIdx * 15 - rowIdx * 10;
      const y = originY + colIdx * 5 + rowIdx * 8;
      const topY = y - h;

      const colors = levelColors[level];
      const w = 10;
      const d = 8;

      const topPoints = `${x},${topY} ${x + w},${topY - 4} ${x + w - d},${topY - 8} ${x - d},${topY - 4}`;
      const leftPoints = `${x - d},${topY - 4} ${x},${topY} ${x},${y} ${x - d},${y - 4}`;
      const rightPoints = `${x},${topY} ${x + w},${topY - 4} ${x + w},${y - 4} ${x},${y}`;

      cubes.push(`
        <polygon points="${leftPoints}" fill="${colors.left}" />
        <polygon points="${rightPoints}" fill="${colors.right}" />
        <polygon points="${topPoints}" fill="${colors.top}" />
      `);
    });
  });

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3D Isometric Contribution Calendar">
  <defs>
    <linearGradient id="bg-grad-3d" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .sub { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .card-bg { fill: url(#bg-grad-3d); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Title & Stats -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path d="M1.5 2.5A2.5 2.5 0 0 1 4 0h8a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 12 16H4a2.5 2.5 0 0 1-2.5-2.5v-11ZM4 1.5A1 1 0 0 0 3 2.5v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1H4Z"/>
    </svg>
    <text x="26" y="0" class="header">3D Contribution Calendar</text>
    <text x="${width - 50}" y="0" class="sub" text-anchor="end">${formatNumber(user.streak.total)} contributions in past year</text>
  </g>

  <!-- Isometric Blocks Grid -->
  <g transform="translate(0, 14)">
    ${cubes.join('')}
  </g>

  <!-- Legend -->
  <g transform="translate(25, ${height - 20})">
    <text x="0" y="9" class="sub">Less</text>
    <rect x="35" y="0" width="11" height="11" rx="2.5" fill="${levelColors[0].top}" />
    <rect x="50" y="0" width="11" height="11" rx="2.5" fill="${levelColors[1].top}" />
    <rect x="65" y="0" width="11" height="11" rx="2.5" fill="${levelColors[2].top}" />
    <rect x="80" y="0" width="11" height="11" rx="2.5" fill="${levelColors[3].top}" />
    <rect x="95" y="0" width="11" height="11" rx="2.5" fill="${levelColors[4].top}" />
    <text x="115" y="9" class="sub">More</text>
  </g>
</svg>
`.trim();
}
