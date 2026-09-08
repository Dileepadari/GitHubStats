import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not configured');
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: false,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL client error:', err.message);
    });
  }
  return pool;
}

// In-memory fallback if database connection has temporary issues
const memoryCache = new Map<string, { data: any; expiresAt: number }>();
const memoryViews = new Map<string, number>();

/**
 * Atomically increments view counter for a username in PostgreSQL
 */
export async function incrementProfileViews(
  username: string,
  metadata?: { ipHash?: string; userAgent?: string; referrer?: string }
): Promise<number> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) return 0;

  try {
    const db = getDbPool();
    const result = await db.query(
      `
      INSERT INTO github_profile_views (username, views, last_viewed_at)
      VALUES ($1, 1, NOW())
      ON CONFLICT (username)
      DO UPDATE SET
        views = github_profile_views.views + 1,
        last_viewed_at = NOW()
      RETURNING views;
      `,
      [cleanUsername]
    );

    const views = parseInt(result.rows[0]?.views || '1', 10);

    // Asynchronously log the view details without blocking
    if (metadata) {
      db.query(
        `
        INSERT INTO github_view_logs (username, ip_hash, user_agent, referrer)
        VALUES ($1, $2, $3, $4)
        `,
        [cleanUsername, metadata.ipHash || null, metadata.userAgent || null, metadata.referrer || null]
      ).catch((err) => console.warn('Failed to insert view log:', err.message));
    }

    // Keep memory fallback in sync
    memoryViews.set(cleanUsername, views);
    return views;
  } catch (err: any) {
    console.warn(`PostgreSQL increment views fallback for ${cleanUsername}:`, err.message);
    const current = (memoryViews.get(cleanUsername) || 0) + 1;
    memoryViews.set(cleanUsername, current);
    return current;
  }
}

/**
 * Gets the current profile view count for a username
 */
export async function getProfileViews(username: string): Promise<number> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) return 0;

  try {
    const db = getDbPool();
    const result = await db.query(
      `SELECT views FROM github_profile_views WHERE username = $1`,
      [cleanUsername]
    );
    if (result.rows.length > 0) {
      const count = parseInt(result.rows[0].views, 10);
      memoryViews.set(cleanUsername, count);
      return count;
    }
    return memoryViews.get(cleanUsername) || 0;
  } catch (err: any) {
    console.warn(`PostgreSQL get views fallback for ${cleanUsername}:`, err.message);
    return memoryViews.get(cleanUsername) || 0;
  }
}

/**
 * Gets cached data from PostgreSQL with memory fallback
 */
export async function getCachedData<T>(cacheKey: string): Promise<T | null> {
  // Check memory cache first
  const mem = memoryCache.get(cacheKey);
  if (mem && mem.expiresAt > Date.now()) {
    return mem.data as T;
  }

  try {
    const db = getDbPool();
    const result = await db.query(
      `SELECT data FROM github_stats_cache WHERE cache_key = $1 AND expires_at > NOW()`,
      [cacheKey]
    );
    if (result.rows.length > 0) {
      const data = result.rows[0].data;
      memoryCache.set(cacheKey, { data, expiresAt: Date.now() + 60000 });
      return data as T;
    }
    return null;
  } catch (err: any) {
    console.warn(`PostgreSQL getCachedData fallback for ${cacheKey}:`, err.message);
    return null;
  }
}

/**
 * Sets cached data in PostgreSQL with memory fallback
 */
export async function setCachedData<T>(
  cacheKey: string,
  data: T,
  ttlSeconds: number = 3600
): Promise<void> {
  const expiresAtMs = Date.now() + ttlSeconds * 1000;
  memoryCache.set(cacheKey, { data, expiresAt: expiresAtMs });

  try {
    const db = getDbPool();
    await db.query(
      `
      INSERT INTO github_stats_cache (cache_key, data, updated_at, expires_at)
      VALUES ($1, $2, NOW(), NOW() + ($3 || ' seconds')::interval)
      ON CONFLICT (cache_key)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW(),
        expires_at = EXCLUDED.expires_at;
      `,
      [cacheKey, JSON.stringify(data), ttlSeconds]
    );
  } catch (err: any) {
    console.warn(`PostgreSQL setCachedData fallback for ${cacheKey}:`, err.message);
  }
}

/**
 * Global stats across the platform
 */
export async function getPlatformStats(): Promise<{
  totalTrackedUsers: number;
  totalViews: number;
  cachedRecords: number;
}> {
  try {
    const db = getDbPool();
    const viewsRes = await db.query(
      `SELECT COUNT(*) as users, COALESCE(SUM(views), 0) as views FROM github_profile_views`
    );
    const cacheRes = await db.query(
      `SELECT COUNT(*) as caches FROM github_stats_cache WHERE expires_at > NOW()`
    );

    return {
      totalTrackedUsers: parseInt(viewsRes.rows[0]?.users || '0', 10),
      totalViews: parseInt(viewsRes.rows[0]?.views || '0', 10),
      cachedRecords: parseInt(cacheRes.rows[0]?.caches || '0', 10),
    };
  } catch (err: any) {
    return {
      totalTrackedUsers: memoryViews.size,
      totalViews: Array.from(memoryViews.values()).reduce((a, b) => a + b, 0),
      cachedRecords: memoryCache.size,
    };
  }
}
