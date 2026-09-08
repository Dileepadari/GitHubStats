import { ThemeColors, resolveTheme } from '../themes';
import { escapeXml } from '../utils';

export function renderErrorCard(
  message: string,
  options: {
    theme?: string | null;
    title?: string;
    width?: number;
    height?: number;
  } = {}
): string {
  const width = options.width || 495;
  const height = options.height || 180;
  const theme = resolveTheme({ theme: options.theme });
  const title = escapeXml(options.title || 'GitHub Stats Error');
  const safeMessage = escapeXml(message);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <style>
    .header { font: 600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: #ef4444; }
    .message { font: 400 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.text}; }
    .subtext { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; fill: ${theme.subtext}; }
    .card-bg { fill: ${theme.bg}; stroke: #ef4444; stroke-width: 1.5; rx: 12px; }
  </style>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" class="card-bg" />
  <g transform="translate(25, 38)">
    <svg x="0" y="0" width="24" height="24" viewBox="0 0 16 16" fill="#ef4444">
      <path fill-rule="evenodd" d="M2.343 13.657A8 8 0 1113.657 2.343 8 8 0 012.343 13.657zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 101.06 1.06L8 9.06l1.97 1.97a.75.75 0 101.06-1.06L9.06 8l1.97-1.97a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z" />
    </svg>
    <text x="36" y="18" class="header">${title}</text>
  </g>
  <g transform="translate(25, 80)">
    <text x="0" y="16" class="message">${safeMessage}</text>
    <text x="0" y="44" class="subtext">Please ensure the username is valid or configure a personal access token.</text>
  </g>
</svg>
`.trim();
}
