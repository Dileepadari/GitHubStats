import { NextResponse } from 'next/server';
import { getPlatformStats, getDbPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatency = 0;

  try {
    const db = getDbPool();
    const t0 = Date.now();
    await db.query('SELECT 1');
    dbLatency = Date.now() - t0;
  } catch (err: any) {
    dbStatus = `unhealthy: ${err.message}`;
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
