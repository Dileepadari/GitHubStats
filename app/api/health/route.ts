/**
 * `GET /api/health` - is the database reachable, and what has the platform served.
 *
 * Reports the database as `unhealthy: <reason>` rather than failing, because
 * every card still renders without Postgres; losing the cache is a degradation,
 * not an outage, and the endpoint should say which.
 *
 * @module api/health
 */
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
