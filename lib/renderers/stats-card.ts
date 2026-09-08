import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber, calculateGrade, SVG_ICONS } from '../utils';

export interface StatsCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  icon_color?: string | null;
  ring_color?: string | null;
  hide_border?: boolean;
  hide_rank?: boolean;
  border_radius?: number;
  custom_title?: string;
}

export function renderStatsCard(user: GitHubUserRawData, options: StatsCardOptions = {}): string {
  const theme = resolveTheme(options);
  const width = options.hide_rank ? 380 : 495;
  const height = 195;
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  
  const rawTitle = options.custom_title || `${user.name || user.login}'s GitHub Stats`;
  const title = escapeXml(rawTitle);

  const grade = calculateGrade({
    stars: user.totalStars,
    commits: user.totalCommits,
    prs: user.totalPRs,
    issues: user.totalIssues,
    followers: user.followers,
    contributedTo: user.contributedTo,
  });

  const stats = [
    { label: 'Total Stars Earned', value: formatNumber(user.totalStars), icon: SVG_ICONS.star },
    { label: 'Total Commits', value: formatNumber(user.totalCommits), icon: SVG_ICONS.commit },
    { label: 'Total PRs', value: formatNumber(user.totalPRs), icon: SVG_ICONS.pr },
    { label: 'Total Issues', value: formatNumber(user.totalIssues), icon: SVG_ICONS.issue },
    { label: 'Contributed To', value: formatNumber(user.contributedTo), icon: SVG_ICONS.repo },
  ];

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (circ * grade.percentile) / 100;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg-grad-stats" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
    <linearGradient id="grade-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${grade.color}" />
      <stop offset="100%" stop-color="${grade.color}cc" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .stat-label { font: 400 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .stat-val { font: 700 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .grade-text { font: 800 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${grade.color}; text-anchor: middle; dominant-baseline: central; }
    .grade-label { font: 600 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; text-anchor: middle; letter-spacing: 0.5px; }
    .card-bg { fill: url(#bg-grad-stats); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .progress-ring-bg { stroke: ${theme.cardBg || theme.border}; stroke-width: 5.5; fill: none; stroke-opacity: 0.8; }
    .progress-ring-val {
      stroke: url(#grade-ring-grad);
      stroke-width: 5.5;
      stroke-linecap: round;
      fill: none;
      stroke-dasharray: ${circ.toFixed(2)};
      stroke-dashoffset: ${strokeDashoffset.toFixed(2)};
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      animation: ring 1.2s ease-in-out forwards;
    }
    @keyframes ring {
      from { stroke-dashoffset: ${circ.toFixed(2)}; }
      to { stroke-dashoffset: ${strokeDashoffset.toFixed(2)}; }
    }
    .fade-item {
      animation: fadeIn 0.8s ease-in-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Card Title with Octicon -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
    </svg>
    <text x="26" y="0" class="header">${title}</text>
  </g>

  <!-- Stat List: Y spacing 25px -->
  <g transform="translate(25, 60)">
    ${stats
      .map((stat, idx) => {
        const y = idx * 24;
        return `
    <g transform="translate(0, ${y})" class="fade-item">
      <svg x="0" y="-12" width="15" height="15" viewBox="0 0 16 16" fill="${theme.icon}">
        ${stat.icon}
      </svg>
      <text x="24" y="0" class="stat-label">${stat.label}:</text>
      <text x="180" y="0" class="stat-val">${stat.value}</text>
    </g>`;
      })
      .join('')}
  </g>

  <!-- Grade Ring Badge -->
  ${
    !options.hide_rank
      ? `
  <g transform="translate(${width - 80}, 112)">
    <circle cx="0" cy="0" r="${radius}" class="progress-ring-bg" />
    <circle cx="0" cy="0" r="${radius}" class="progress-ring-val" />
    <text x="0" y="-3" class="grade-text">${grade.grade}</text>
    <text x="0" y="16" class="grade-label">TOP ${(100 - grade.percentile).toFixed(1)}%</text>
  </g>`
      : ''
  }
</svg>
`.trim();
}
