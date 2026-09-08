import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/github';
import { renderStatsCard } from '@/lib/renderers/stats-card';
import { renderErrorCard } from '@/lib/renderers/error-card';
import { calculateGrade } from '@/lib/utils';

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
      const grade = calculateGrade({
        stars: data.totalStars,
        commits: data.totalCommits,
        prs: data.totalPRs,
        issues: data.totalIssues,
        followers: data.followers,
        contributedTo: data.contributedTo,
      });

      return NextResponse.json({
        username: data.login,
        name: data.name,
        totalStars: data.totalStars,
        totalCommits: data.totalCommits,
        totalPRs: data.totalPRs,
        totalIssues: data.totalIssues,
        contributedTo: data.contributedTo,
        followers: data.followers,
        following: data.following,
        publicRepos: data.publicRepos,
        grade,
      });
    }

    const svg = renderStatsCard(data, {
      theme: searchParams.get('theme'),
      bg_color: searchParams.get('bg_color'),
      border_color: searchParams.get('border_color'),
      title_color: searchParams.get('title_color'),
      text_color: searchParams.get('text_color'),
      icon_color: searchParams.get('icon_color'),
      ring_color: searchParams.get('ring_color'),
      hide_border: searchParams.get('hide_border') === 'true',
      hide_rank: searchParams.get('hide_rank') === 'true',
      border_radius: searchParams.get('border_radius')
        ? parseInt(searchParams.get('border_radius')!, 10)
        : undefined,
      custom_title: searchParams.get('custom_title') || undefined,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    if (format === 'json') {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return new NextResponse(renderErrorCard(err.message), {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }
}
