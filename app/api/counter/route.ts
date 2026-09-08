import { NextRequest, NextResponse } from 'next/server';
import { incrementProfileViews, getProfileViews } from '@/lib/db';
import { renderProfileCounter } from '@/lib/renderers/counter-card';
import { renderErrorCard } from '@/lib/renderers/error-card';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const format = searchParams.get('format') || 'svg';
  const shouldIncrement = searchParams.get('increment') !== 'false';

  if (!username) {
    if (format === 'json') {
      return NextResponse.json({ error: 'Username query parameter is required' }, { status: 400 });
    }
    return new NextResponse(renderErrorCard('Missing "username" query parameter'), {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }

  try {
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    const forwardedFor = request.headers.get('x-forwarded-for') || undefined;

    let views: number;
    if (shouldIncrement) {
      views = await incrementProfileViews(username, {
        userAgent,
        referrer,
        ipHash: forwardedFor ? forwardedFor.split(',')[0].trim() : undefined,
      });
    } else {
      views = await getProfileViews(username);
    }

    if (format === 'json') {
      return NextResponse.json({
        username,
        views,
        incremented: shouldIncrement,
      });
    }

    const svg = renderProfileCounter(views, {
      theme: searchParams.get('theme'),
      bg_color: searchParams.get('bg_color'),
      text_color: searchParams.get('text_color'),
      style: (searchParams.get('style') as any) || 'flat',
      label: searchParams.get('label') || 'Profile Views',
      pad_zeros: searchParams.get('pad_zeros')
        ? parseInt(searchParams.get('pad_zeros')!, 10)
        : undefined,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        Pragma: 'no-cache',
        Expires: '0',
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
