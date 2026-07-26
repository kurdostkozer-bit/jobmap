-- ============================================================
-- P2.9.2 — Database Verification After Indexes
-- ============================================================

-- 1. Verify all indexes were created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'jobs'
ORDER BY indexname;

-- 2. Index Performance Statistics
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as "Scans",
  idx_tup_read as "Tuples Read",
  idx_tup_fetch as "Tuples Fetched",
  pg_size_pretty(pg_relation_size(indexrelid)) as "Size"
FROM pg_stat_user_indexes
WHERE tablename = 'jobs'
ORDER BY idx_scan DESC;

-- 3. Table Statistics
SELECT 
  schemaname,
  relname,
  n_live_tup as "Live Rows",
  n_dead_tup as "Dead Rows",
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
WHERE relname = 'jobs';

-- 4. Cache Hit Ratio (should be > 99%)
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  CASE 
    WHEN (sum(heap_blks_hit) + sum(heap_blks_read)) = 0 THEN 0
    ELSE ROUND((100.0 * sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)))::numeric, 2)
  END as hit_ratio_percent
FROM pg_statio_user_tables
WHERE relname = 'jobs';

-- 5. Test optimized bounds query
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
  job.id,
  job."anonymizedLatitude",
  job."anonymizedLongitude",
  job.title,
  job.category,
  job."salaryMin",
  job."salaryMax",
  job."jobType",
  job."applicantsCount",
  job."createdAt"
FROM jobs job
WHERE job."isActive" = true
  AND job."anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND job."anonymizedLongitude" BETWEEN 43.0 AND 45.0
ORDER BY job."createdAt" DESC
LIMIT 100;

-- 6. Test with different bounds (tight zoom)
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM jobs
WHERE "isActive" = true
  AND "anonymizedLatitude" BETWEEN 33.3 AND 33.4
  AND "anonymizedLongitude" BETWEEN 44.3 AND 44.4;

-- 7. Test filtering by category
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM jobs
WHERE "isActive" = true
  AND "anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND "anonymizedLongitude" BETWEEN 43.0 AND 45.0
  AND category = 'IT';

-- 8. Test salary range filtering
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM jobs
WHERE "isActive" = true
  AND "anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND "anonymizedLongitude" BETWEEN 43.0 AND 45.0
  AND "salaryMin" >= 1000000
  AND "salaryMax" <= 5000000;

-- 9. Database Connection Info
SHOW max_connections;
SHOW shared_buffers;
SHOW effective_cache_size;

-- 10. Slow query log (if enabled)
SELECT 
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
WHERE query LIKE '%jobs%'
ORDER BY mean_exec_time DESC
LIMIT 10;

-- 11. Final Index Summary
SELECT 
  'Indexes Created' as status,
  COUNT(*) as count
FROM pg_indexes
WHERE tablename = 'jobs';
