/**
 * `GET /api/summary` - one card with the profile, the totals and the top languages.
 *
 * Answers SVG by default and JSON with `?format=json`, because the same data
 * serves a README badge and a script. Errors render as a card too: a broken
 * image in a profile README tells the reader nothing, an error card tells them
 * what went wrong.
 *
 * @module api/summary
 */
import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/github';
import { renderSummaryCard } from '@/lib/renderers/summary-card';
import { renderErrorCard } from '@/lib/renderers/error-card';
import { errorMessage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const format = searchParams.get('format') || 'svg';

  if (!username) {
    if (format === 'json') {
      return NextResponse.json({ error: 'Username query parameter is required' }, { status: 400 });
    }
    return new NextResponse(renderErrorCard('Missing "username" query parameter'), {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }

  try {
    const data = await fetchGitHubData(username);

    if (format === 'json') {
      return NextResponse.json({
        username: data.login,
        name: data.name,
        bio: data.bio,
        totalStars: data.totalStars,
        totalCommits: data.totalCommits,
        totalPRs: data.totalPRs,
        longestStreak: data.streak.longest,
        topLanguages: data.languages.slice(0, 5),
      });
    }

    const svg = renderSummaryCard(data, {
      theme: searchParams.get('theme'),
      bg_color: searchParams.get('bg_color'),
      border_color: searchParams.get('border_color'),
      title_color: searchParams.get('title_color'),
      text_color: searchParams.get('text_color'),
      hide_border: searchParams.get('hide_border') === 'true',
      border_radius: searchParams.get('border_radius')
        ? parseInt(searchParams.get('border_radius')!, 10)
        : undefined,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    if (format === 'json') {
      return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
    }
    return new NextResponse(renderErrorCard(errorMessage(err)), {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }
}
