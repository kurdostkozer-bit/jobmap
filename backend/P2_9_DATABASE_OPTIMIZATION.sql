-- ============================================================
-- P2.9.2 — Database EXPLAIN ANALYZE & Optimization
-- ============================================================
-- Identifies slow queries and applies indexes

-- 1. Current Query Analysis (Before Indexes)
-- This is the main query used in searchByBounds endpoint

EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT 
  job.id, 
  job."anonymizedLatitude", 
  job."anonymizedLongitude",
  job.title, 
  job.category,
  job."salaryMin", 
  job."salaryMax",
  job."jobType",
  job.company, 
  job."applicantsCount",
  job."createdAt"
FROM jobs job
WHERE job."isActive" = true
  AND job."anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND job."anonymizedLongitude" BETWEEN 43.0 AND 45.0
ORDER BY job."createdAt" DESC
LIMIT 100;

-- 2. Check current indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'jobs'
ORDER BY indexname;

-- 3. Create Spatial Indexes (Primary optimization)
-- These are critical for bounds queries

CREATE INDEX IF NOT EXISTS idx_job_anonymized_lat_lng 
ON jobs (
  "anonymizedLatitude" DESC,
  "anonymizedLongitude" DESC
);

-- 4. Create Status Index (for isActive filtering)
CREATE INDEX IF NOT EXISTS idx_job_is_active 
ON jobs ("isActive") 
WHERE "isActive" = true;

-- 5. Create Company Index (for ownership queries)
CREATE INDEX IF NOT EXISTS idx_job_company_id 
ON jobs ("companyId");

-- 6. Create Category Index (for filtering)
CREATE INDEX IF NOT EXISTS idx_job_category 
ON jobs ("category");

-- 7. Create Salary Range Index (for salary filtering)
CREATE INDEX IF NOT EXISTS idx_job_salary_range 
ON jobs ("salaryMin", "salaryMax");

-- 8. Create composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_job_bounds_active 
ON jobs (
  "isActive",
  "anonymizedLatitude" DESC,
  "anonymizedLongitude" DESC,
  "createdAt" DESC
)
WHERE "isActive" = true;

-- 9. Analyze table to update statistics
ANALYZE jobs;

-- 10. Re-run EXPLAIN ANALYZE after indexes (for comparison)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT 
  job.id, 
  job."anonymizedLatitude", 
  job."anonymizedLongitude",
  job.title, 
  job.category,
  job."salaryMin", 
  job."salaryMax",
  job."jobType",
  job.company, 
  job."applicantsCount",
  job."createdAt"
FROM jobs job
WHERE job."isActive" = true
  AND job."anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND job."anonymizedLongitude" BETWEEN 43.0 AND 45.0
ORDER BY job."createdAt" DESC
LIMIT 100;

-- 11. Check for N+1 queries (company lookups)
-- Current issue: leftJoinAndSelect('job.company') may cause issues
-- Verify only one query runs:

EXPLAIN (ANALYZE, BUFFERS)
SELECT job.id, job.title, job."companyId"
FROM jobs job
WHERE job."isActive" = true
LIMIT 10;

-- 12. Verify index sizes and bloat
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as "Index Scans",
  idx_tup_read as "Tuples Read",
  idx_tup_fetch as "Tuples Fetched",
  pg_size_pretty(pg_relation_size(indexrelid)) as "Index Size"
FROM pg_stat_user_indexes
WHERE tablename = 'jobs'
ORDER BY idx_scan DESC;

-- 13. Connection Pool Configuration Check
-- (This is PostgreSQL server-side; app-side pool is configured in NestJS)
SHOW max_connections;
SHOW max_prepared_transactions;

-- 14. Cache Statistics
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as hit_ratio
FROM pg_statio_user_tables
WHERE relname = 'jobs';

-- 15. Query Plan Comparison for Different Bounds

-- Small bounds (tight rectangle)
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM jobs
WHERE "isActive" = true
  AND "anonymizedLatitude" BETWEEN 33.3 AND 33.4
  AND "anonymizedLongitude" BETWEEN 44.3 AND 44.4;

-- Medium bounds (zoom level 7-8)
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM jobs
WHERE "isActive" = true
  AND "anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND "anonymizedLongitude" BETWEEN 43.0 AND 45.0;

-- Large bounds (zoom level 5)
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM jobs
WHERE "isActive" = true
  AND "anonymizedLatitude" BETWEEN 30.0 AND 37.0
  AND "anonymizedLongitude" BETWEEN 41.0 AND 48.0;

-- 16. Verify table stats
SELECT 
  tablename,
  n_live_tup as "Live Rows",
  n_dead_tup as "Dead Rows",
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
WHERE tablename = 'jobs';

-- 17. Test connection pool behavior
-- This query should complete quickly after indexes are added
SELECT 
  datname,
  usename,
  application_name,
  state,
  COUNT(*) as connection_count
FROM pg_stat_activity
WHERE datname = 'jobmap'
GROUP BY datname, usename, application_name, state
ORDER BY connection_count DESC;

-- Summary Report
SELECT 
  'Total Jobs' as metric,
  COUNT(*) as value
FROM jobs
UNION ALL
SELECT 
  'Active Jobs',
  COUNT(*)
FROM jobs WHERE "isActive" = true
UNION ALL
SELECT
  'Index Count',
  COUNT(*)
FROM pg_stat_user_indexes
WHERE tablename = 'jobs';
