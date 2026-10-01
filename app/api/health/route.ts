import { NextResponse } from 'next/server';
import { getPlatformStats, getDbPool } from '@/lib/db';
import { errorMessage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dbStatus = 'healthy';
  let dbLatency = 0;

  try {
    const db = getDbPool();
    const t0 = Date.now();
    await db.query('SELECT 1');
    dbLatency = Date.now() - t0;
  } catch (err: unknown) {
    dbStatus = `unhealthy: ${errorMessage(err)}`;
  }

  const platformStats = await getPlatformStats();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
    },
    platform: platformStats,
  });
}
