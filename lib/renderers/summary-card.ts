import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber, calculateGrade } from '../utils';

export interface SummaryCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
}

export function renderSummaryCard(
  user: GitHubUserRawData,
  options: SummaryCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const width = 495;
  const height = 210;

  const grade = calculateGrade({
    stars: user.totalStars,
    commits: user.totalCommits,
    prs: user.totalPRs,
    issues: user.totalIssues,
    followers: user.followers,
    contributedTo: user.contributedTo,
  });

  const topLangs = user.languages.slice(0, 3);

  // Clean bio
  const cleanBio = user.bio
    ? user.bio.replace(/\s+/g, ' ').trim()
    : 'Open source enthusiast & developer';
  const truncatedBio = cleanBio.length > 55 ? `${cleanBio.slice(0, 52)}...` : cleanBio;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(user.name || user.login)} Developer Summary">
  <defs>
    <linearGradient id="bg-grad-summary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .name { font: 700 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .handle { font: 500 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .bio { font: 400 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .stat-val { font: 700 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .stat-lbl { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .rank-val { font: 900 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${grade.color}; text-anchor: middle; dominant-baseline: central; }
    .rank-lbl { font: 700 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; text-anchor: middle; letter-spacing: 0.5px; }
    .card-bg { fill: url(#bg-grad-summary); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Top Header Profile Info -->
  <g transform="translate(25, 24)">
    <text x="0" y="14" class="name">${escapeXml(user.name || user.login)}</text>
    <text x="0" y="30" class="handle">@${escapeXml(user.login)} ${user.location ? `• ${escapeXml(user.location.slice(0, 25))}` : ''}</text>
    <text x="0" y="47" class="bio">${escapeXml(truncatedBio)}</text>
  </g>

  <!-- Rank Badge in top right -->
  <g transform="translate(${width - 55}, 46)">
    <circle cx="0" cy="0" r="24" fill="${theme.cardBg || '#161b22'}" stroke="${grade.color}" stroke-width="2" />
    <text x="0" y="-1" class="rank-val">${grade.grade}</text>
    <text x="0" y="34" class="rank-lbl">RANK</text>
  </g>

  <!-- Divider -->
  <line x1="25" y1="84" x2="${width - 25}" y2="84" stroke="${theme.border}" stroke-opacity="0.5" stroke-width="1" />

  <!-- 4 Stats Column -->
  <g transform="translate(25, 96)">
    <g transform="translate(0, 0)">
      <text x="0" y="16" class="stat-val">${formatNumber(user.totalStars)}</text>
      <text x="0" y="32" class="stat-lbl">Stars Earned</text>
    </g>
    <g transform="translate(110, 0)">
      <text x="0" y="16" class="stat-val">${formatNumber(user.totalCommits)}</text>
      <text x="0" y="32" class="stat-lbl">Total Commits</text>
    </g>
    <g transform="translate(225, 0)">
      <text x="0" y="16" class="stat-val">${formatNumber(user.totalPRs)}</text>
      <text x="0" y="32" class="stat-lbl">Pull Requests</text>
    </g>
    <g transform="translate(340, 0)">
      <text x="0" y="16" class="stat-val">${formatNumber(user.streak.longest)}d</text>
      <text x="0" y="32" class="stat-lbl">Best Streak</text>
    </g>
  </g>

  <!-- Mini Languages Bar Section -->
  <g transform="translate(25, 150)">
    <text x="0" y="10" class="stat-lbl" font-weight="600">Top Languages:</text>
    <g transform="translate(0, 16)">
      ${topLangs
        .map((l, i) => {
          const x = i * 145;
          return `
      <g transform="translate(${x}, 0)">
        <rect x="0" y="2" width="135" height="24" rx="6" fill="${theme.cardBg || '#161b22'}" stroke="${theme.border}" stroke-width="0.8" />
        <circle cx="12" cy="14" r="4.5" fill="${l.color}" />
        <text x="22" y="18" font-size="11" font-weight="600" fill="${theme.text}">${escapeXml(l.name.slice(0, 10))}</text>
        <text x="125" y="18" font-size="10.5" font-weight="500" fill="${theme.subtext}" text-anchor="end">${l.percent.toFixed(0)}%</text>
      </g>`;
        })
        .join('')}
    </g>
  </g>
</svg>
`.trim();
}
