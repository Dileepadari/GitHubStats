import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber } from '../utils';

export interface TrophiesCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
  columns?: number;
}

interface TrophyTier {
  rank: 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C';
  label: string;
  value: string;
  color: string;
  bgGradient: [string, string];
}

export function renderTrophiesCard(
  user: GitHubUserRawData,
  options: TrophiesCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;

  const joinedYear = new Date(user.createdAt || Date.now()).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsActive = Math.max(currentYear - joinedYear, 1);

  const trophies: Array<{ name: string; tier: TrophyTier }> = [
    {
      name: 'Commits',
      tier: evaluateTier(user.totalCommits, [
        { threshold: 5000, rank: 'SSS' },
        { threshold: 2500, rank: 'SS' },
        { threshold: 1000, rank: 'S' },
        { threshold: 500, rank: 'A' },
        { threshold: 100, rank: 'B' },
      ], `${formatNumber(user.totalCommits)} Commits`),
    },
    {
      name: 'Stars',
      tier: evaluateTier(user.totalStars, [
        { threshold: 1000, rank: 'SSS' },
        { threshold: 500, rank: 'SS' },
        { threshold: 100, rank: 'S' },
        { threshold: 25, rank: 'A' },
        { threshold: 5, rank: 'B' },
      ], `${formatNumber(user.totalStars)} Stars`),
    },
    {
      name: 'Followers',
      tier: evaluateTier(user.followers, [
        { threshold: 1000, rank: 'SSS' },
        { threshold: 500, rank: 'SS' },
        { threshold: 100, rank: 'S' },
        { threshold: 25, rank: 'A' },
        { threshold: 5, rank: 'B' },
      ], `${formatNumber(user.followers)} Followers`),
    },
    {
      name: 'Pull Requests',
      tier: evaluateTier(user.totalPRs, [
        { threshold: 200, rank: 'SSS' },
        { threshold: 100, rank: 'SS' },
        { threshold: 50, rank: 'S' },
        { threshold: 20, rank: 'A' },
        { threshold: 5, rank: 'B' },
      ], `${formatNumber(user.totalPRs)} PRs`),
    },
    {
      name: 'Issues',
      tier: evaluateTier(user.totalIssues, [
        { threshold: 200, rank: 'SSS' },
        { threshold: 100, rank: 'SS' },
        { threshold: 50, rank: 'S' },
        { threshold: 20, rank: 'A' },
        { threshold: 5, rank: 'B' },
      ], `${formatNumber(user.totalIssues)} Issues`),
    },
    {
      name: 'Veteran',
      tier: evaluateTier(yearsActive, [
        { threshold: 10, rank: 'SSS' },
        { threshold: 7, rank: 'SS' },
        { threshold: 5, rank: 'S' },
        { threshold: 3, rank: 'A' },
        { threshold: 2, rank: 'B' },
      ], `${yearsActive} yrs on GitHub`),
    },
  ];

  const cols = 3;
  const trophyWidth = 140;
  const trophyHeight = 88;
  const cardWidth = 495;
  const cardHeight = 245;

  return `
<svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Profile Trophies">
  <defs>
    <linearGradient id="bg-grad-trophies" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .card-bg { fill: url(#bg-grad-trophies); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .trophy-title { font: 600 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; text-anchor: middle; }
    .trophy-val { font: 400 10.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; text-anchor: middle; }
    .rank-text { font: 800 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; text-anchor: middle; dominant-baseline: central; }
  </style>

  <rect x="0.6" y="0.6" width="${cardWidth - 1.2}" height="${cardHeight - 1.2}" class="card-bg" />

  <!-- Title with Trophy Icon -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path fill-rule="evenodd" d="M3.75 1.5a.75.75 0 0 0-.75.75v1.652c0 1.517.9 2.87 2.28 3.444A5.252 5.252 0 0 0 7.25 9.94V12H5.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H8.75V9.94a5.252 5.252 0 0 0 1.97-2.594c1.38-.574 2.28-1.927 2.28-3.444V2.25a.75.75 0 0 0-.75-.75h-8.5ZM4.5 3h7v.902c0 .99-.57 1.884-1.46 2.275a.75.75 0 0 0-.45.548 3.75 3.75 0 0 1-3.18 2.763 3.75 3.75 0 0 1-3.18-2.763.75.75 0 0 0-.45-.548C2.07 5.786 1.5 4.892 1.5 3.902V3h3Z"/>
    </svg>
    <text x="26" y="0" class="header">GitHub Trophies</text>
  </g>

  <!-- Trophy Grid -->
  <g transform="translate(25, 48)">
    ${trophies
      .map((t, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = c * (trophyWidth + 12);
        const y = r * (trophyHeight + 10);

        return `
    <g transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="${trophyWidth}" height="${trophyHeight}" rx="8" fill="${theme.cardBg || '#161b22'}" stroke="${t.tier.color}" stroke-width="1.2" stroke-opacity="0.6" />
      <circle cx="${trophyWidth / 2}" cy="26" r="16" fill="${t.tier.bgGradient[0]}" fill-opacity="0.18" stroke="${t.tier.color}" stroke-width="1.5" />
      <text x="${trophyWidth / 2}" y="27" class="rank-text" fill="${t.tier.color}">${t.tier.rank}</text>
      <text x="${trophyWidth / 2}" y="55" class="trophy-title">${escapeXml(t.name)}</text>
      <text x="${trophyWidth / 2}" y="71" class="trophy-val">${escapeXml(t.tier.value)}</text>
    </g>`;
      })
      .join('')}
  </g>
</svg>
`.trim();
}

function evaluateTier(
  val: number,
  tiers: Array<{ threshold: number; rank: 'SSS' | 'SS' | 'S' | 'A' | 'B' }>,
  valueLabel: string
): TrophyTier {
  for (const t of tiers) {
    if (val >= t.threshold) {
      if (t.rank === 'SSS') {
        return { rank: 'SSS', label: 'Mythic', value: valueLabel, color: '#f43f5e', bgGradient: ['#f43f5e', '#ec4899'] };
      }
      if (t.rank === 'SS') {
        return { rank: 'SS', label: 'Diamond', value: valueLabel, color: '#fbbf24', bgGradient: ['#fbbf24', '#d97706'] };
      }
      if (t.rank === 'S') {
        return { rank: 'S', label: 'Gold', value: valueLabel, color: '#38bdf8', bgGradient: ['#38bdf8', '#0284c7'] };
      }
      if (t.rank === 'A') {
        return { rank: 'A', label: 'Silver', value: valueLabel, color: '#34d399', bgGradient: ['#34d399', '#059669'] };
      }
      return { rank: 'B', label: 'Bronze', value: valueLabel, color: '#818cf8', bgGradient: ['#818cf8', '#4f46e5'] };
    }
  }
  return { rank: 'C', label: 'Standard', value: valueLabel, color: '#94a3b8', bgGradient: ['#94a3b8', '#64748b'] };
}
