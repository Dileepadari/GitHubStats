import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber } from '../utils';

export interface StreakCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  icon_color?: string | null;
  fire_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
}

export function renderStreakCard(
  user: GitHubUserRawData,
  options: StreakCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const width = 495;
  const height = 195;

  const { current, longest, total } = user.streak;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Streak Stats">
  <defs>
    <linearGradient id="bg-grad-streak" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
    <linearGradient id="fire-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#fb923c" />
    </linearGradient>
    <filter id="flame-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .stat-number { font: 800 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; text-anchor: middle; }
    .stat-label { font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; text-anchor: middle; }
    .stat-sub { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; text-anchor: middle; }
    .card-bg { fill: url(#bg-grad-streak); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .divider { stroke: ${theme.border}; stroke-width: 1; stroke-opacity: 0.5; }
    .flame-anim {
      transform-origin: center;
      animation: flamePulse 1.8s infinite alternate ease-in-out;
    }
    @keyframes flamePulse {
      0% { transform: scale(0.95); opacity: 0.92; }
      100% { transform: scale(1.08); opacity: 1; }
    }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Section 1: Total Contributions -->
  <g transform="translate(82, 42)">
    <text x="0" y="32" class="stat-number">${formatNumber(total)}</text>
    <text x="0" y="58" class="stat-label">Total Contributions</text>
    <text x="0" y="78" class="stat-sub">Past 12 Months</text>
  </g>

  <!-- Divider 1 -->
  <line x1="165" y1="30" x2="165" y2="165" class="divider" />

  <!-- Section 2: Current Streak (Center with Glowing Flame) -->
  <g transform="translate(247, 24)">
    <g class="flame-anim" transform="translate(-16, 0)">
      <svg width="32" height="32" viewBox="0 0 16 16" fill="url(#fire-grad)" filter="url(#flame-glow)">
        <path fill-rule="evenodd" d="M8.28 1.284a.75.75 0 0 0-1.06 0l-.82.82c-.8.8-1.4 1.83-1.4 2.966 0 .42.083.82.235 1.189A4.75 4.75 0 0 0 3.25 10.75c0 2.623 2.127 4.75 4.75 4.75s4.75-2.127 4.75-4.75c0-1.928-1.15-3.587-2.793-4.32a4.49 4.49 0 0 0 .543-2.11c0-1.392-.76-2.55-1.72-3.036ZM8 3.5a1.5 1.5 0 0 1 1.5 1.5c0 .64-.38 1.21-.94 1.44a.75.75 0 0 0-.46.7 3.25 3.25 0 0 0 1.4 2.66c.92.65 1.5 1.72 1.5 2.95a3.25 3.25 0 0 1-6.5 0c0-1.45.83-2.7 2.05-3.29.35-.17.55-.54.5-.25A1.5 1.5 0 0 1 8 3.5Z"/>
      </svg>
    </g>
    <text x="0" y="56" class="stat-number">${current} <tspan font-size="15" font-weight="600" fill="${theme.subtext}">days</tspan></text>
    <text x="0" y="80" class="stat-label">Current Streak</text>
    <text x="0" y="98" class="stat-sub">${current > 0 ? 'Streak Active' : 'No Active Streak'}</text>
  </g>

  <!-- Divider 2 -->
  <line x1="330" y1="30" x2="330" y2="165" class="divider" />

  <!-- Section 3: Longest Streak -->
  <g transform="translate(412, 42)">
    <text x="0" y="32" class="stat-number">${longest} <tspan font-size="15" font-weight="600" fill="${theme.subtext}">days</tspan></text>
    <text x="0" y="58" class="stat-label">Longest Streak</text>
    <text x="0" y="78" class="stat-sub">Personal Record</text>
  </g>
</svg>
`.trim();
}
