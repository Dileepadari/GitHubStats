/**
 * Every card renders well-formed SVG, and hostile text stays text.
 *
 * The whole product is SVG built by template literal, which means two failures
 * that no "did it return a string" check can see:
 *
 *   1. A renderer emits malformed XML. The endpoint still answers 200 with
 *      `image/svg+xml`, and every browser and GitHub README draws nothing.
 *   2. A name, bio or label containing `<` closes a tag early. Served as
 *      `image/svg+xml`, an injected `<script>` runs for whoever opens the card
 *      URL directly, with the card's origin.
 *
 * So this renders all thirteen cards twice: once with ordinary data, and once
 * with every text field carrying markup. The second pass asserts the element
 * count is unchanged, which is the property that matters - escaping may turn
 * `<` into `&lt;` however it likes, as long as no new element appears.
 *
 * No XML library: the parser below is the smallest thing that can tell a
 * balanced document from an unbalanced one, and this repository has no runtime
 * dependency it needs to earn.
 *
 * Run: npx tsx scripts/check-cards.ts
 */
import { renderStatsCard } from '../lib/renderers/stats-card';
import { renderTopLangsCard } from '../lib/renderers/top-langs-card';
import { renderStreakCard } from '../lib/renderers/streak-card';
import { renderSummaryCard } from '../lib/renderers/summary-card';
import { renderTrophiesCard } from '../lib/renderers/trophies-card';
import { renderAchievementsCard } from '../lib/renderers/achievements-card';
import { renderActivityGraph } from '../lib/renderers/activity-graph';
import { renderCalendar3D } from '../lib/renderers/calendar-3d';
import { renderIssueStatsCard } from '../lib/renderers/issues-card';
import { renderPRStatsCard } from '../lib/renderers/prs-card';
import { renderErrorCard } from '../lib/renderers/error-card';
import { renderProfileCounter } from '../lib/renderers/counter-card';
import type { GitHubUserRawData } from '../lib/github';

/** A tag-balance check. Returns an error string, or null when well formed. */
function xmlProblem(svg: string): string | null {
  if (!svg.trimStart().startsWith('<svg')) return 'does not start with <svg';
  const stack: string[] = [];
  const tag = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let m: RegExpExecArray | null;
  let consumed = 0;
  while ((m = tag.exec(svg)) !== null) {
    const [full, closing, name, attrs, selfClose] = m;
    consumed = m.index + full.length;
    if (closing) {
      const open = stack.pop();
      if (open !== name) return `</${name}> closes <${open ?? 'nothing'}>`;
    } else if (!selfClose) {
      stack.push(name);
    }
    // An unquoted < inside an attribute would have ended the tag early.
    if (attrs.includes('<')) return `stray < inside a <${name}> attribute`;
  }
  if (stack.length) return `unclosed <${stack[stack.length - 1]}>`;
  if (svg.slice(consumed).includes('<')) return 'trailing < after the last tag';
  return null;
}

const countElements = (svg: string) => (svg.match(/<[a-zA-Z]/g) || []).length;

const PAYLOAD = '"><script>alert(1)</script><text x="0';

function user(text: string): GitHubUserRawData {
  return {
    login: text, name: text, avatarUrl: '', bio: text, company: text,
    location: text, websiteUrl: '', twitterUsername: text,
    createdAt: '2019-04-01T00:00:00Z',
    followers: 120, following: 30, publicRepos: 42, publicGists: 3,
    totalStars: 318, totalForks: 44, totalCommits: 2140, totalPRs: 96,
    mergedPRs: 81, totalIssues: 57, closedIssues: 40, totalReviews: 23,
    contributedTo: 11,
    streak: { current: 7, longest: 54, total: 2140, startDate: '2024-01-01', endDate: '2026-01-01' },
    languages: [{ name: text, bytes: 1000, color: '#3178c6', percent: 60 },
                { name: 'Python', bytes: 500, color: '#3572A5', percent: 40 }],
    activityHistory: Array.from({ length: 30 }, (_, i) => ({ date: `2026-01-${String(i + 1).padStart(2, '0')}`, count: i })),
    calendarWeeks: Array.from({ length: 53 }, () => ({
      days: Array.from({ length: 7 }, (_, d) => ({ date: '2026-01-01', count: d, level: d % 5 })),
    })),
  };
}

const cards: Array<[string, (u: GitHubUserRawData, text: string) => string]> = [
  ['stats', (u) => renderStatsCard(u, {})],
  ['stats-custom-title', (u, t) => renderStatsCard(u, { custom_title: t })],
  ['top-langs', (u) => renderTopLangsCard(u, {})],
  ['streak', (u) => renderStreakCard(u, {})],
  ['summary', (u) => renderSummaryCard(u, {})],
  ['trophies', (u) => renderTrophiesCard(u, {})],
  ['achievements', (u) => renderAchievementsCard(u, {})],
  ['activity-graph', (u) => renderActivityGraph(u, {})],
  ['calendar-3d', (u) => renderCalendar3D(u, {})],
  ['issues', (u) => renderIssueStatsCard(u, {})],
  ['prs', (u) => renderPRStatsCard(u, {})],
  ['error', (_u, t) => renderErrorCard(t)],
  ['counter', (_u, t) => renderProfileCounter(1234, { label: t })],
];

let failed = 0;
const plain = user('Octo Cat');
const hostile = user(PAYLOAD);

for (const [name, render] of cards) {
  const safe = render(plain, 'A Title');
  const problem = xmlProblem(safe);
  if (problem) {
    console.error(`FAIL ${name}: ${problem}`);
    failed++;
    continue;
  }

  const attacked = render(hostile, PAYLOAD);
  const attackedProblem = xmlProblem(attacked);
  if (attackedProblem) {
    console.error(`FAIL ${name} with markup in its text: ${attackedProblem}`);
    failed++;
    continue;
  }
  if (attacked.includes('<script')) {
    console.error(`FAIL ${name}: a <script> element reached the output`);
    failed++;
    continue;
  }
  if (countElements(attacked) !== countElements(safe)) {
    console.error(
      `FAIL ${name}: hostile text changed the element count, ` +
      `${countElements(safe)} to ${countElements(attacked)}`,
    );
    failed++;
    continue;
  }
  console.log(`ok   ${name}`);
}

console.log(`\n${cards.length - failed}/${cards.length} cards render valid SVG and escape their text`);
process.exit(failed === 0 ? 0 : 1);
