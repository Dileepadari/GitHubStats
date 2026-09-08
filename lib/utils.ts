/**
 * Escapes special XML characters to prevent SVG injection/XSS vulnerabilities
 */
export function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format numbers with K/M abbreviations (e.g. 1250 -> 1.3k)
 */
export function formatNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
}

/**
 * Calculate user rank/grade score based on GitHub stats
 */
export interface UserGrade {
  grade: string;
  score: number;
  percentile: number;
  color: string;
}

export function calculateGrade(stats: {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  followers: number;
  contributedTo: number;
}): UserGrade {
  // Weighted algorithmic score
  const score =
    stats.stars * 10 +
    stats.commits * 1.5 +
    stats.prs * 15 +
    stats.issues * 5 +
    stats.followers * 5 +
    stats.contributedTo * 20;

  if (score >= 5000) {
    return { grade: 'S+', score, percentile: 99.5, color: '#f59e0b' };
  } else if (score >= 2500) {
    return { grade: 'S', score, percentile: 98, color: '#eab308' };
  } else if (score >= 1200) {
    return { grade: 'A+', score, percentile: 92, color: '#10b981' };
  } else if (score >= 600) {
    return { grade: 'A', score, percentile: 85, color: '#34d399' };
  } else if (score >= 300) {
    return { grade: 'B+', score, percentile: 70, color: '#38bdf8' };
  } else if (score >= 100) {
    return { grade: 'B', score, percentile: 50, color: '#818cf8' };
  }
  return { grade: 'C', score, percentile: 25, color: '#94a3b8' };
}

/**
 * Common SVG icons as reusable SVG path elements
 */
export const SVG_ICONS = {
  star: '<path fill-rule="evenodd" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>',
  fork: '<path fill-rule="evenodd" d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5A2.25 2.25 0 0 0 12.5 6.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.878Zm6.75-2.122a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0ZM9 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>',
  commit: '<path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm1.43 0a3.999 3.999 0 0 0-7.86 0H.75a.75.75 0 0 0 0 1.5h3.32a3.999 3.999 0 0 0 7.86 0h3.32a.75.75 0 0 0 0-1.5h-3.32Z"/>',
  pr: '<path fill-rule="evenodd" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854v4.792a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25-4.25a2.25 2.25 0 1 0-1.5 0v2.25a.75.75 0 0 1-.75.75h-2a.75.75 0 0 0 0 1.5h2a2.25 2.25 0 0 0 2.25-2.25V7.75Zm-1.5-3.5a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"/>',
  issue: '<path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm9 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5z"/>',
  repo: '<path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8V1.5Z"/>',
  fire: '<path fill-rule="evenodd" d="M8.28 1.284a.75.75 0 0 0-1.06 0l-.82.82c-.8.8-1.4 1.83-1.4 2.966 0 .42.083.82.235 1.189A4.75 4.75 0 0 0 3.25 10.75c0 2.623 2.127 4.75 4.75 4.75s4.75-2.127 4.75-4.75c0-1.928-1.15-3.587-2.793-4.32a4.49 4.49 0 0 0 .543-2.11c0-1.392-.76-2.55-1.72-3.036ZM8 3.5a1.5 1.5 0 0 1 1.5 1.5c0 .64-.38 1.21-.94 1.44a.75.75 0 0 0-.46.7 3.25 3.25 0 0 0 1.4 2.66c.92.65 1.5 1.72 1.5 2.95a3.25 3.25 0 0 1-6.5 0c0-1.45.83-2.7 2.05-3.29.35-.17.55-.54.5-9.25A1.5 1.5 0 0 1 8 3.5Z"/>',
  trophy: '<path fill-rule="evenodd" d="M3.75 1.5a.75.75 0 0 0-.75.75v1.652c0 1.517.9 2.87 2.28 3.444A5.252 5.252 0 0 0 7.25 9.94V12H5.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H8.75V9.94a5.252 5.252 0 0 0 1.97-2.594c1.38-.574 2.28-1.927 2.28-3.444V2.25a.75.75 0 0 0-.75-.75h-8.5ZM4.5 3h7v.902c0 .99-.57 1.884-1.46 2.275a.75.75 0 0 0-.45.548 3.75 3.75 0 0 1-3.18 2.763 3.75 3.75 0 0 1-3.18-2.763.75.75 0 0 0-.45-.548C2.07 5.786 1.5 4.892 1.5 3.902V3h3Z"/>',
  eye: '<path d="M1.5 8s3-5.5 6.5-5.5S14.5 8 14.5 8s-3 5.5-6.5 5.5S1.5 8 1.5 8Z"/><circle cx="8" cy="8" r="2.5"/>',
  clock: '<path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.25a.75.75 0 0 1 .75.75v3.19l2.22 1.33a.75.75 0 1 1-.77 1.28l-2.5-1.5A.75.75 0 0 1 7.25 9V5.5A.75.75 0 0 1 8 4.75Z"/>',
  check: '<path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>',
  user: '<path fill-rule="evenodd" d="M12 4a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-2 4.5a3 3 0 1 0-4 0 3 3 0 0 0 4 0Zm4.75 7.25a.75.75 0 0 1-.75.75H2a.75.75 0 0 1-.75-.75 4.75 4.75 0 0 1 4.75-4.75h4a4.75 4.75 0 0 1 4.75 4.75Z"/>',
};
