import { GitHubUserRawData } from '../github';
import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml, formatNumber } from '../utils';

export interface ActivityGraphOptions {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  line_color?: string | null;
  hide_border?: boolean;
  border_radius?: number;
  custom_title?: string;
}

export function renderActivityGraph(
  user: GitHubUserRawData,
  options: ActivityGraphOptions = {}
): string {
  const theme = resolveTheme(options);
  const rx = options.border_radius !== undefined ? options.border_radius : 10;
  const width = 600;
  const height = 220;
  const lineColor = options.line_color || theme.title;
  const title = escapeXml(options.custom_title || 'Contribution Activity (Last 30 Days)');

  const data = user.activityHistory.slice(-30);
  const maxVal = Math.max(...data.map((d) => d.count), 5);

  const graphX = 45;
  const graphY = 50;
  const graphWidth = width - 75;
  const graphHeight = 115;

  // Calculate coordinates
  const points = data.map((d, idx) => {
    const x = graphX + (idx / (data.length - 1 || 1)) * graphWidth;
    const y = graphY + graphHeight - (d.count / maxVal) * graphHeight;
    return { x, y, count: d.count, date: d.date };
  });

  // Build SVG path with smooth cubic Bezier curves
  let pathD = '';
  let areaD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx.toFixed(1)} ${p0.y.toFixed(1)}, ${mx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    const lastP = points[points.length - 1];
    areaD = `${pathD} L ${lastP.x.toFixed(1)} ${(graphY + graphHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(graphY + graphHeight).toFixed(1)} Z`;
  }

  // Pick 5 date labels for the X axis
  const step = Math.floor(data.length / 4);
  const dateLabels = [0, step, step * 2, step * 3, data.length - 1].map((idx) => {
    const p = points[idx];
    const rawDate = data[idx]?.date || '';
    const dateFormatted = rawDate.slice(5); // MM-DD
    return { x: p?.x || 0, label: dateFormatted };
  });

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg-grad-graph" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.cardBg || theme.bg}" />
    </linearGradient>
    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.0" />
    </linearGradient>
    <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${lineColor}" flood-opacity="0.4" />
    </filter>
  </defs>

  <style>
    .header { font: 600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.title}; }
    .axis-label { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .card-bg { fill: url(#bg-grad-graph); ${options.hide_border ? '' : `stroke: ${theme.border}; stroke-width: 1.2;`} rx: ${rx}px; }
    .grid-line { stroke: ${theme.border}; stroke-dasharray: 3, 3; stroke-width: 0.8; stroke-opacity: 0.4; }
    .chart-line { stroke: ${lineColor}; stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round; filter: url(#lineGlow); }
    .chart-area { fill: url(#areaGradient); }
    .chart-point { fill: ${theme.bg}; stroke: ${lineColor}; stroke-width: 2; }
  </style>

  <rect x="0.6" y="0.6" width="${width - 1.2}" height="${height - 1.2}" class="card-bg" />

  <!-- Title with Line Graph Icon -->
  <g transform="translate(25, 30)">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="${theme.title}" y="-14">
      <path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 0 0-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 0 0 0-1.5H1.5V1.75Zm14.28 4.47a.75.75 0 0 0-1.06-1.06l-4.72 4.72-2.47-2.47a.75.75 0 0 0-1.06 0L3.72 10.16a.75.75 0 1 0 1.06 1.06l2.19-2.19 2.47 2.47a.75.75 0 0 0 1.06 0l5.28-5.28Z"/>
    </svg>
    <text x="26" y="0" class="header">${title}</text>
  </g>

  <!-- Horizontal Grid Lines -->
  <line x1="${graphX}" y1="${graphY}" x2="${graphX + graphWidth}" y2="${graphY}" class="grid-line" />
  <line x1="${graphX}" y1="${graphY + graphHeight / 2}" x2="${graphX + graphWidth}" y2="${graphY + graphHeight / 2}" class="grid-line" />
  <line x1="${graphX}" y1="${graphY + graphHeight}" x2="${graphX + graphWidth}" y2="${graphY + graphHeight}" class="grid-line" />

  <!-- Y Axis Values -->
  <text x="${graphX - 8}" y="${graphY + 4}" class="axis-label" text-anchor="end">${maxVal}</text>
  <text x="${graphX - 8}" y="${graphY + graphHeight / 2 + 4}" class="axis-label" text-anchor="end">${Math.round(maxVal / 2)}</text>
  <text x="${graphX - 8}" y="${graphY + graphHeight + 4}" class="axis-label" text-anchor="end">0</text>

  <!-- Area Fill -->
  <path d="${areaD}" class="chart-area" />

  <!-- Spline Line -->
  <path d="${pathD}" class="chart-line" />

  <!-- Data Point dots -->
  ${points
    .filter((p) => p.count > 0)
    .map(
      (p) => `
  <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.8" class="chart-point" />`
    )
    .join('')}

  <!-- X Axis Date Labels -->
  ${dateLabels
    .map(
      (lbl) => `
  <text x="${lbl.x.toFixed(1)}" y="${graphY + graphHeight + 18}" class="axis-label" text-anchor="middle">${lbl.label}</text>`
    )
    .join('')}
</svg>
`.trim();
}
