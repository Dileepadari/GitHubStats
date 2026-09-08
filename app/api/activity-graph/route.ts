import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/github';
import { renderActivityGraph } from '@/lib/renderers/activity-graph';
import { renderErrorCard } from '@/lib/renderers/error-card';

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
        activityHistory: data.activityHistory,
      });
    }

    const svg = renderActivityGraph(data, {
      theme: searchParams.get('theme'),
      bg_color: searchParams.get('bg_color'),
      border_color: searchParams.get('border_color'),
      title_color: searchParams.get('title_color'),
      line_color: searchParams.get('line_color'),
      hide_border: searchParams.get('hide_border') === 'true',
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
