import { NextRequest, NextResponse } from 'next/server';
import { renderWakaTimeCard, WakaTimeData } from '@/lib/renderers/wakatime-card';
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

  let wakaData: WakaTimeData = {};

  try {
    const wakaRes = await fetch(
      `https://wakatime.com/api/v1/users/${encodeURIComponent(username)}/stats/last_7_days`,
      { headers: { 'User-Agent': 'GitHubStats/1.0' }, next: { revalidate: 3600 } }
    );

    if (wakaRes.ok) {
      const json = await wakaRes.json();
      const d = json.data;
      if (d) {
        wakaData = {
          humanReadableTotal: d.human_readable_total || '0 hrs',
          dailyAverage: d.human_readable_daily_average || '0 hrs',
          languages: (d.languages || []).map((l: any) => ({
            name: l.name,
            percent: l.percent || 0,
            text: l.text || '',
          })),
          editors: (d.editors || []).map((e: any) => ({
            name: e.name,
            percent: e.percent || 0,
            text: e.text || '',
          })),
          operatingSystems: (d.operating_systems || []).map((o: any) => ({
            name: o.name,
            percent: o.percent || 0,
            text: o.text || '',
          })),
          isMock: false,
        };
      }
    }
  } catch (err: any) {
    console.warn(`WakaTime lookup for ${username} error:`, err.message);
  }

  // Fallback defaults if no public WakaTime profile
  if (!wakaData.humanReadableTotal) {
    wakaData = {
      humanReadableTotal: '24 hrs 15 mins',
      dailyAverage: '3 hrs 28 mins',
      languages: [
        { name: 'TypeScript', percent: 48.5, text: '11 hrs 45 mins' },
        { name: 'Python', percent: 27.2, text: '6 hrs 35 mins' },
        { name: 'Rust', percent: 14.8, text: '3 hrs 35 mins' },
        { name: 'Other', percent: 9.5, text: '2 hrs 20 mins' },
      ],
      isMock: true,
    };
  }

  if (format === 'json') {
    return NextResponse.json({
      username,
      ...wakaData,
    });
  }

  const svg = renderWakaTimeCard(username, wakaData, {
    theme: searchParams.get('theme'),
    bg_color: searchParams.get('bg_color'),
    border_color: searchParams.get('border_color'),
    title_color: searchParams.get('title_color'),
    text_color: searchParams.get('text_color'),
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
}
