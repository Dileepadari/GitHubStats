import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml } from '../utils';

export interface AchievementsCardOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
}

interface Achievement {
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  tier?: string;
  badgeBg: string;
}

export function renderAchievementsCard(
  user: GitHubUserRawData,
  options: AchievementsCardOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;

  const joinedYear = new Date(user.createdAt || Date.now()).getFullYear();

  const achievements: Achievement[] = [
    {
      name: 'Pull Shark',
      desc: 'Merged pull requests',
      tier: user.mergedPRs >= 16 ? 'x2' : undefined,
      unlocked: user.mergedPRs > 0,
      icon: '🦈',
      badgeBg: '#38bdf8',
    },
    {
      name: 'Quickdraw',
      desc: 'Closed an issue or PR quickly',
      unlocked: user.closedIssues > 0 || user.mergedPRs > 0,
      icon: '⚡',
      badgeBg: '#f59e0b',
    },
    {
      name: 'Starstruck',
      desc: 'Repository with 16+ stars',
      unlocked: user.totalStars >= 16,
      icon: '⭐',
      badgeBg: '#fbbf24',
    },
    {
      name: 'Galaxy Brain',
      desc: 'Helpful discussion answer',
      unlocked: user.totalIssues >= 5 || user.contributedTo >= 3,
      icon: '🧠',
      badgeBg: '#a855f7',
    },
    {
      name: 'Arctic Code Vault',
      desc: '2020 GitHub archive',
      unlocked: joinedYear <= 2020,
      icon: '❄️',
      badgeBg: '#0ea5e9',
    },
    {
      name: 'YOLO',
      desc: 'Merged code without review',
      unlocked: user.totalCommits > 10,
      icon: '🚀',
      badgeBg: '#ec4899',
    },
  ];

  const width = 495;
  const itemWidth = 140;
  const itemHeight = 88;
  const cols = 3;
  const cardHeight = 245;

  return `
<svg width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Profile Achievements">
  <defs>
    <linearGradient id="bg-grad-achieve" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .card-bg { fill: url(#bg-grad-achieve); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .badge-name { font: 600 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.text}; text-anchor: middle; }
    .badge-desc { font: 400 9.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; text-anchor: middle; }
    .tier-badge { font: 700 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #ffffff; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${cardHeight - 1.2}" class="card-bg" />

  <!-- Title -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path d="M8 0a4 4 0 0 1 4 4v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V4a4 4 0 0 1 4-4ZM5.5 4v1h5V4a2.5 2.5 0 0 0-5 0Z"/>
      <path d="M4 7a1 1 0 0 0-1 1v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4V8a1 1 0 0 0-1-1H4Zm4 7a2.5 2.5 0 0 1-2.5-2.5V8.5h5v3A2.5 2.5 0 0 1 8 14Z"/>
    </svg>
    <text x="26" y="0" class="header">GitHub Achievements</text>
  </g>

  <!-- Badges Grid -->
  <g transform="translate(25, 48)">
    ${achievements
      .map((item, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = c * (itemWidth + 12);
        const y = r * (itemHeight + 10);
        const opacity = item.unlocked ? 1.0 : 0.35;

        return `
    <g transform="translate(${x}, ${y})" opacity="${opacity}">
      <rect x="0" y="0" width="${itemWidth}" height="${itemHeight}" rx="8" fill="${theme.cardBg || '#161b22'}" stroke="${item.unlocked ? item.badgeBg : theme.border}" stroke-width="1.2" stroke-opacity="0.65" />
      <circle cx="${itemWidth / 2}" cy="26" r="16" fill="${item.badgeBg}" fill-opacity="${item.unlocked ? 0.22 : 0.08}" />
      <text x="${itemWidth / 2}" y="32" font-size="16" text-anchor="middle">${item.icon}</text>
      ${
        item.tier
          ? `
      <rect x="${itemWidth / 2 + 10}" y="10" width="18" height="12" rx="3" fill="${item.badgeBg}" />
      <text x="${itemWidth / 2 + 19}" y="19" class="tier-badge" text-anchor="middle">${item.tier}</text>`
          : ''
      }
      <text x="${itemWidth / 2}" y="55" class="badge-name">${escapeXml(item.name)}</text>
      <text x="${itemWidth / 2}" y="69" class="badge-desc">${escapeXml(item.desc)}</text>
    </g>`;
      })
      .join('')}
  </g>
</svg>
`.trim();
}
