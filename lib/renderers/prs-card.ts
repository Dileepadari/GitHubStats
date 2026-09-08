import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber, SVG_ICONS } from '../utils';

export interface PRStatsCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  icon_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
}

export function renderPRStatsCard(
  user: GitHubUserRawData,
  options: PRStatsCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const width = 495;
  const height = 195;

  const totalPRs = user.totalPRs || 0;
  const mergedPRs = user.mergedPRs || 0;
  const closedPRs = Math.max(totalPRs - mergedPRs, 0);
  const mergeRate = totalPRs > 0 ? ((mergedPRs / totalPRs) * 100).toFixed(1) : '100';

  const stats = [
    { label: 'PRs Created', value: formatNumber(totalPRs), color: theme.title },
    { label: 'PRs Merged', value: formatNumber(mergedPRs), color: '#a855f7' },
    { label: 'PRs Closed', value: formatNumber(closedPRs), color: '#ef4444' },
    { label: 'Code Reviews', value: formatNumber(user.totalReviews), color: '#10b981' },
  ];

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pull Request &amp; Code Review Stats">
  <defs>
    <linearGradient id="bg-grad-prs" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .card-bg { fill: url(#bg-grad-prs); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .stat-label { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .stat-val { font: 700 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .rate-label { font: 600 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Title -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      ${SVG_ICONS.pr}
    </svg>
    <text x="26" y="0" class="header">Pull Requests &amp; Reviews</text>
  </g>

  <!-- 2x2 Grid of Stats -->
  <g transform="translate(25, 52)">
    ${stats
      .map((st, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = col * 225;
        const y = row * 45;

        return `
    <g transform="translate(${x}, ${y})">
      <text x="0" y="16" class="stat-val" fill="${st.color}">${st.value}</text>
      <text x="0" y="32" class="stat-label">${st.label}</text>
    </g>`;
      })
      .join('')}
  </g>

  <!-- Merge Rate Progress Bar -->
  <g transform="translate(25, 150)">
    <text x="0" y="0" class="rate-label">Merge Acceptance Rate: ${mergeRate}%</text>
    <rect x="0" y="10" width="445" height="8" rx="4" fill="${theme.cardBg || '#161b22'}" stroke="${theme.border}" stroke-width="0.5" />
    <rect x="0" y="10" width="${Math.max((parseFloat(mergeRate) / 100) * 445, 4)}" height="8" rx="4" fill="#a855f7" />
  </g>
</svg>
`.trim();
}
