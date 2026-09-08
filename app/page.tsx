'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Flame,
  Code2,
  LineChart,
  Trophy,
  GitPullRequest,
  AlertCircle,
  Clock,
  Box,
  Award,
  UserCheck,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Database,
  Sparkles,
  Layers,
  Settings2,
  RefreshCw,
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const PRESET_USERS = ['Dileepadari', 'torvalds', 'octocat', 'shadcn', 'leerob'];

const THEMES = [
  { id: 'default', name: 'GitHub Dark', color: '#58a6ff', bg: '#0d1117' },
  { id: 'radical', name: 'Radical Neon', color: '#fe428e', bg: '#141321' },
  { id: 'dracula', name: 'Dracula', color: '#ff79c6', bg: '#282a36' },
  { id: 'tokyonight', name: 'Tokyo Night', color: '#7aa2f7', bg: '#1a1b26' },
  { id: 'catppuccin', name: 'Catppuccin Mocha', color: '#cba6f7', bg: '#1e1e2e' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#00ffcc', bg: '#050714' },
  { id: 'nord', name: 'Nord', color: '#88c0d0', bg: '#2e3440' },
  { id: 'synthwave', name: 'Synthwave 84', color: '#f92aad', bg: '#2b213a' },
  { id: 'vue', name: 'Vue Dark', color: '#41b883', bg: '#0f172a' },
  { id: 'emerald', name: 'Emerald Forest', color: '#34d399', bg: '#06281e' },
  { id: 'midnight', name: 'Deep Midnight', color: '#38bdf8', bg: '#020617' },
  { id: 'light', name: 'GitHub Light', color: '#0969da', bg: '#ffffff' },
];

const CARDS = [
  {
    id: 'stats',
    name: 'Overview Stats',
    icon: BarChart3,
    endpoint: '/api/stats',
    description: 'Stars, Commits, PRs, Issues, and calculated Dev Grade ring badge',
    badge: 'Popular',
  },
  {
    id: 'streak',
    name: 'Streak & Habits',
    icon: Flame,
    endpoint: '/api/streak',
    description: 'Current active streak, longest streak record, and annual contributions',
    badge: 'Trending',
  },
  {
    id: 'top-langs',
    name: 'Top Languages',
    icon: Code2,
    endpoint: '/api/top-langs',
    description: 'Multi-color segmented language breakdown and percentages',
  },
  {
    id: 'activity-graph',
    name: 'Activity Graph',
    icon: LineChart,
    endpoint: '/api/activity-graph',
    description: 'Smooth cubic Bezier spline curve of contributions over last 30 days',
  },
  {
    id: 'trophies',
    name: 'Gamified Trophies',
    icon: Trophy,
    endpoint: '/api/trophies',
    description: 'Prestige trophies (SSS, SS, S, A, B, C) across 6 skill categories',
  },
  {
    id: 'summary',
    name: 'Developer Summary',
    icon: UserCheck,
    endpoint: '/api/summary',
    description: 'All-in-one profile card with bio, stats, rank badge, and top languages',
    badge: 'New',
  },
  {
    id: 'calendar-3d',
    name: '3D Isometric Calendar',
    icon: Box,
    endpoint: '/api/calendar-3d',
    description: 'Stunning 3D isometric perspective representation of contribution grid',
  },
  {
    id: 'achievements',
    name: 'GitHub Achievements',
    icon: Award,
    endpoint: '/api/achievements',
    description: 'Official-style achievement badges (Pull Shark, Quickdraw, Starstruck)',
  },
  {
    id: 'prs',
    name: 'Pull Requests & Reviews',
    icon: GitPullRequest,
    endpoint: '/api/prs',
    description: 'PR created, merged, review turnaround, and acceptance rate',
  },
  {
    id: 'issues',
    name: 'Issues & Discussions',
    icon: AlertCircle,
    endpoint: '/api/issues',
    description: 'Issue resolution rate, closed items, and community participation',
  },
  {
    id: 'wakatime',
    name: 'WakaTime Coding Time',
    icon: Clock,
    endpoint: '/api/wakatime',
    description: 'IDE tracking, active hours logged, and top programming languages',
  },
  {
    id: 'counter',
    name: 'Profile View Counter',
    icon: Eye,
    endpoint: '/api/counter',
    description: 'Atomic visitor hit counter stored in Supabase PostgreSQL database',
    badge: 'PostgreSQL',
  },
];

export default function Home() {
  const [username, setUsername] = useState('Dileepadari');
  const [inputUsername, setInputUsername] = useState('Dileepadari');
  const [theme, setTheme] = useState('default');
  const [hideBorder, setHideBorder] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('stats');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState('');
  const [counterHits, setCounterHits] = useState<number | null>(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterStyle, setCounterStyle] = useState<'flat' | 'pill' | 'cyberpunk'>('flat');
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    setHostUrl(window.location.origin);

    // Fetch initial health/stats
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch((err) => console.warn('Health check fetch error:', err));
  }, []);

  const handleApplyUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
    }
  };

  const selectedCard = CARDS.find((c) => c.id === selectedCardId) || CARDS[0];

  const buildUrl = (endpoint: string, extraParams: Record<string, string> = {}, absolute: boolean = false) => {
    const params = new URLSearchParams({
      username,
      theme,
      ...(hideBorder ? { hide_border: 'true' } : {}),
      ...extraParams,
    });
    const prefix = absolute ? (hostUrl || 'https://githubstats.vercel.app') : '';
    return `${prefix}${endpoint}?${params.toString()}`;
  };

  const previewSrc = buildUrl(selectedCard.endpoint, {
    ...(selectedCard.id === 'counter' ? { style: counterStyle } : {}),
  }, false);

  const embedUrl = buildUrl(selectedCard.endpoint, {
    ...(selectedCard.id === 'counter' ? { style: counterStyle } : {}),
  }, true);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestCounterIncrement = async () => {
    setCounterLoading(true);
    try {
      const res = await fetch(`/api/counter?username=${encodeURIComponent(username)}&format=json`);
      const data = await res.json();
      setCounterHits(data.views);
    } catch (err) {
      console.error(err);
    } finally {
      setCounterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0c111d]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                GitHubStats
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20">
                Serverless API
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {healthData && (
              <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Postgres: {healthData.database?.status === 'healthy' ? 'Connected' : 'Active'}</span>
                <span className="text-slate-600">•</span>
                <span>{healthData.platform?.totalViews || 0} hits</span>
              </div>
            )}
            <a
              href="https://github.com/Dileepadari"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-sm font-medium border border-slate-700 transition"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Production-Ready GitHub Profile Cards &amp; REST/SVG Endpoints</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Every GitHub Stat Tool,{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Unified &amp; Instant.
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Generate dynamic, customizable SVG cards and JSON endpoints for your GitHub profile README.
            Backed by persistent Supabase PostgreSQL caching and live view counters.
          </p>
        </div>

        {/* Control Bar: Username & Presets */}
        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl shadow-black/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Input Form */}
            <form onSubmit={handleApplyUser} className="lg:col-span-6 flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="Enter GitHub username (e.g. torvalds)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition flex items-center space-x-1.5 shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Render</span>
              </button>
            </form>

            {/* Presets */}
            <div className="lg:col-span-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
              {PRESET_USERS.map((user) => (
                <button
                  key={user}
                  onClick={() => {
                    setInputUsername(user);
                    setUsername(user);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition border ${
                    username.toLowerCase() === user.toLowerCase()
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sm'
                      : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  @{user}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector & Options */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5" />
                <span>Theme:</span>
              </span>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    theme === t.id
                      ? 'bg-slate-800 text-white border-sky-500/80 ring-1 ring-sky-500'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: t.color }}
                  ></span>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideBorder}
                  onChange={(e) => setHideBorder(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500/20"
                />
                <span>Hide Border</span>
              </label>

              {selectedCard.id === 'counter' && (
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-slate-400">Style:</span>
                  {(['flat', 'pill', 'cyberpunk'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setCounterStyle(st)}
                      className={`px-2 py-0.5 rounded capitalize ${
                        counterStyle === st
                          ? 'bg-sky-500/20 text-sky-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout: Cards Sidebar + Live Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Card Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Available Endpoints ({CARDS.length})</span>
            </h2>

            <div className="space-y-1.5">
              {CARDS.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedCardId === card.id;

                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-900/30 to-indigo-900/20 border-sky-500/50 shadow-md shadow-sky-950/40 text-white'
                        : 'bg-[#0f172a]/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                            : 'bg-slate-800/80 text-slate-400 group-hover:text-sky-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                          <span>{card.name}</span>
                          {card.badge && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-sky-500/20 text-sky-400 uppercase">
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {card.endpoint}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas & Embed Code Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-6 shadow-2xl shadow-black/50">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{selectedCard.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                      {selectedCard.endpoint}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedCard.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={previewSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
                    title="Open SVG directly"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open SVG</span>
                  </a>
                  <a
                    href={buildUrl(selectedCard.endpoint, { format: 'json' }, false)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
                    title="Inspect JSON format"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>JSON API</span>
                  </a>
                </div>
              </div>

              {/* SVG Live Preview Container */}
              <div className="p-8 rounded-xl bg-[#090d16] border border-slate-800/80 flex flex-col items-center justify-center min-h-[280px] overflow-auto shadow-inner">
                {/* Embedded SVG Object / Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt={selectedCard.name}
                  className="max-w-full h-auto drop-shadow-2xl transition-all duration-300 rounded-lg"
                />

                {/* Live Counter Trigger if Counter Card selected */}
                {selectedCard.id === 'counter' && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleTestCounterIncrement}
                      disabled={counterLoading}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{counterLoading ? 'Querying Postgres...' : 'Simulate Visit Hit (+1)'}</span>
                    </button>
                    {counterHits !== null && (
                      <span className="text-xs text-emerald-400 font-medium">
                        Live DB views for @{username}: <strong className="text-white">{counterHits}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Embed Code Snippets */}
              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Copy Embed Snippet
                </h3>

                {/* Markdown snippet */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Markdown (Profile README)</div>
                    <code className="text-xs text-sky-300 font-mono block truncate select-all">
                      {`![${selectedCard.name}](${embedUrl})`}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`![${selectedCard.name}](${embedUrl})`, 'md')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                    title="Copy Markdown"
                  >
                    {copiedKey === 'md' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* HTML tag */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">HTML Tag</div>
                    <code className="text-xs text-emerald-300 font-mono block truncate select-all">
                      {`<img src="${embedUrl}" alt="${selectedCard.name}" />`}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`<img src="${embedUrl}" alt="${selectedCard.name}" />`, 'html')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                    title="Copy HTML"
                  >
                    {copiedKey === 'html' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Direct SVG URL */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Direct Raw URL</div>
                    <code className="text-xs text-amber-300 font-mono block truncate select-all">
                      {embedUrl}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(embedUrl, 'url')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                    title="Copy URL"
                  >
                    {copiedKey === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Reference & Parameter Docs */}
        <section className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">API Reference &amp; Query Parameters</h2>
              <p className="text-xs text-slate-400">All endpoints support both high-res SVG image output and JSON data format</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">username</td>
                  <td className="py-2.5 px-4 text-slate-400">string (required)</td>
                  <td className="py-2.5 px-4 text-slate-500">-</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">GitHub user login handle (e.g. torvalds, octocat)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">theme</td>
                  <td className="py-2.5 px-4 text-slate-400">string</td>
                  <td className="py-2.5 px-4 text-slate-500">default</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">default, radical, dracula, tokyonight, catppuccin, cyberpunk, nord, vue, synthwave, light</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">format</td>
                  <td className="py-2.5 px-4 text-slate-400">svg | json</td>
                  <td className="py-2.5 px-4 text-slate-500">svg</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">Return raw XML SVG for README embedding or JSON payload for headless applications</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">hide_border</td>
                  <td className="py-2.5 px-4 text-slate-400">boolean</td>
                  <td className="py-2.5 px-4 text-slate-500">false</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">When true, removes the outer card border</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">border_radius</td>
                  <td className="py-2.5 px-4 text-slate-400">number</td>
                  <td className="py-2.5 px-4 text-slate-500">12</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">Custom border corner radius in pixels</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">bg_color / text_color</td>
                  <td className="py-2.5 px-4 text-slate-400">hex string</td>
                  <td className="py-2.5 px-4 text-slate-500">theme defaults</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">Override specific colors without hash (e.g. bg_color=0d1117)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-sky-400 font-semibold">style (for /api/counter)</td>
                  <td className="py-2.5 px-4 text-slate-400">flat | pill | cyberpunk</td>
                  <td className="py-2.5 px-4 text-slate-500">flat</td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">Visual style variant for the profile visitor counter badge</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0c111d] py-8 text-center text-xs text-slate-500">
        <p>
          GitHubStats • Production-Ready GitHub Profile Cards &amp; API Service • Hosted on Vercel &amp; Supabase PostgreSQL
        </p>
      </footer>
    </div>
  );
}
