export interface ThemeColors {
  bg: string;
  cardBg?: string;
  border: string;
  title: string;
  text: string;
  subtext: string;
  icon: string;
  accent: string;
  gradient?: [string, string];
  ring: string;
}

export const THEMES: Record<string, ThemeColors> = {
  default: {
    bg: '#0d1117',
    cardBg: '#161b22',
    border: '#30363d',
    title: '#58a6ff',
    text: '#c9d1d9',
    subtext: '#8b949e',
    icon: '#79c0ff',
    accent: '#238636',
    gradient: ['#0d1117', '#161b22'],
    ring: '#58a6ff',
  },
  'github-dark': {
    bg: '#0d1117',
    cardBg: '#161b22',
    border: '#30363d',
    title: '#58a6ff',
    text: '#c9d1d9',
    subtext: '#8b949e',
    icon: '#79c0ff',
    accent: '#238636',
    gradient: ['#0d1117', '#161b22'],
    ring: '#58a6ff',
  },
  radical: {
    bg: '#141321',
    cardBg: '#1a1829',
    border: '#fe428e',
    title: '#fe428e',
    text: '#a9fef7',
    subtext: '#b193f3',
    icon: '#f8d847',
    accent: '#fe428e',
    gradient: ['#141321', '#1f1933'],
    ring: '#fe428e',
  },
  dracula: {
    bg: '#282a36',
    cardBg: '#21222c',
    border: '#6272a4',
    title: '#ff79c6',
    text: '#f8f8f2',
    subtext: '#bd93f9',
    icon: '#50fa7b',
    accent: '#ffb86c',
    gradient: ['#282a36', '#343746'],
    ring: '#ff79c6',
  },
  tokyonight: {
    bg: '#1a1b26',
    cardBg: '#16161e',
    border: '#3b4261',
    title: '#7aa2f7',
    text: '#a9b1d6',
    subtext: '#787c99',
    icon: '#bb9af7',
    accent: '#7dcfff',
    gradient: ['#1a1b26', '#24283b'],
    ring: '#7aa2f7',
  },
  catppuccin: {
    bg: '#1e1e2e',
    cardBg: '#181825',
    border: '#45475a',
    title: '#cba6f7',
    text: '#cdd6f4',
    subtext: '#a6adc8',
    icon: '#f38ba8',
    accent: '#89b4fa',
    gradient: ['#1e1e2e', '#313244'],
    ring: '#cba6f7',
  },
  cyberpunk: {
    bg: '#050714',
    cardBg: '#090d24',
    border: '#00ffcc',
    title: '#ffe600',
    text: '#ffffff',
    subtext: '#00ffcc',
    icon: '#ff0055',
    accent: '#00ffcc',
    gradient: ['#050714', '#151336'],
    ring: '#00ffcc',
  },
  nord: {
    bg: '#2e3440',
    cardBg: '#272c36',
    border: '#4c566a',
    title: '#88c0d0',
    text: '#eceff4',
    subtext: '#d8dee9',
    icon: '#ebcb8b',
    accent: '#a3be8c',
    gradient: ['#2e3440', '#3b4252'],
    ring: '#88c0d0',
  },
  synthwave: {
    bg: '#2b213a',
    cardBg: '#241b31',
    border: '#ff7edb',
    title: '#f92aad',
    text: '#fdfdfd',
    subtext: '#fe4450',
    icon: '#36f9f6',
    accent: '#ff7edb',
    gradient: ['#2b213a', '#3f2d54'],
    ring: '#f92aad',
  },
  vue: {
    bg: '#0f172a',
    cardBg: '#1e293b',
    border: '#41b883',
    title: '#41b883',
    text: '#f1f5f9',
    subtext: '#94a3b8',
    icon: '#35495e',
    accent: '#41b883',
    gradient: ['#0f172a', '#1e293b'],
    ring: '#41b883',
  },
  'solarized-dark': {
    bg: '#002b36',
    cardBg: '#073642',
    border: '#586e75',
    title: '#268bd2',
    text: '#93a1a1',
    subtext: '#839496',
    icon: '#b58900',
    accent: '#2aa198',
    gradient: ['#002b36', '#073642'],
    ring: '#268bd2',
  },
  light: {
    bg: '#ffffff',
    cardBg: '#f6f8fa',
    border: '#d0d7de',
    title: '#0969da',
    text: '#1f2328',
    subtext: '#656d76',
    icon: '#1f2328',
    accent: '#1a7f37',
    gradient: ['#ffffff', '#f6f8fa'],
    ring: '#0969da',
  },
  emerald: {
    bg: '#06281e',
    cardBg: '#093628',
    border: '#10b981',
    title: '#34d399',
    text: '#ecfdf5',
    subtext: '#a7f3d0',
    icon: '#6ee7b7',
    accent: '#059669',
    gradient: ['#06281e', '#0b4a37'],
    ring: '#10b981',
  },
  midnight: {
    bg: '#020617',
    cardBg: '#0f172a',
    border: '#1e293b',
    title: '#38bdf8',
    text: '#e2e8f0',
    subtext: '#94a3b8',
    icon: '#60a5fa',
    accent: '#0ea5e9',
    gradient: ['#020617', '#0f172a'],
    ring: '#38bdf8',
  },
};

export function resolveTheme(params: {
  theme?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  title_color?: string | null;
  text_color?: string | null;
  subtext_color?: string | null;
  icon_color?: string | null;
  accent_color?: string | null;
  ring_color?: string | null;
}): ThemeColors {
  const themeKey = (params.theme || 'default').toLowerCase();
  const base = THEMES[themeKey] || THEMES.default;

  const sanitizeHex = (val?: string | null): string | undefined => {
    if (!val) return undefined;
    const clean = val.replace(/[^a-fA-F0-9]/g, '');
    if (clean.length === 3 || clean.length === 6 || clean.length === 8) {
      return `#${clean}`;
    }
    return undefined;
  };

  return {
    bg: sanitizeHex(params.bg_color) || base.bg,
    cardBg: base.cardBg,
    border: sanitizeHex(params.border_color) || base.border,
    title: sanitizeHex(params.title_color) || base.title,
    text: sanitizeHex(params.text_color) || base.text,
    subtext: sanitizeHex(params.subtext_color) || base.subtext,
    icon: sanitizeHex(params.icon_color) || base.icon,
    accent: sanitizeHex(params.accent_color) || base.accent,
    gradient: base.gradient,
    ring: sanitizeHex(params.ring_color) || base.ring,
  };
}
