-- ============================================================
-- P2.9.3 — Iraq Real Data Testing
-- ============================================================
-- Replace test data with real Iraqi coordinates and test clustering

-- 1. Clear test data
DELETE FROM jobs;

-- 2. Insert real Iraq data (actual governorate coordinates)
INSERT INTO jobs (
  id, "companyId", title, description, category,
  "salaryMin", "salaryMax", "salaryCurrency",
  governorate, district, neighborhood,
  "realLatitude", "realLongitude",
  "anonymizedLatitude", "anonymizedLongitude",
  skills, languages, "jobType", "experienceLevel",
  "applicantsCount", "isActive", "createdAt", "updatedAt"
)

-- Baghdad (45 jobs in Baghdad area)
SELECT
  gen_random_uuid() as id,
  gen_random_uuid() as "companyId",
  ARRAY['Senior React Developer', 'Backend Engineer', 'DevOps Specialist', 'Product Manager', 'Data Scientist'][floor(random()*5)::int+1] as title,
  'Quality job opportunity in Baghdad' as description,
  ARRAY['IT', 'Design', 'Finance', 'Sales'][floor(random()*4)::int+1] as category,
  2000000::decimal as "salaryMin",
  5000000::decimal as "salaryMax",
  'IQD' as "salaryCurrency",
  'Baghdad' as governorate,
  'Downtown' as district,
  ARRAY['Karada', 'Mansour', 'Jadiriya', 'Doura'][floor(random()*4)::int+1] as neighborhood,
  (33.3128 + (random()-0.5)*0.15)::decimal(10,8) as "realLatitude",
  (44.3615 + (random()-0.5)*0.15)::decimal(11,8) as "realLongitude",
  (33.3128 + (random()-0.5)*0.15)::decimal(10,8) as "anonymizedLatitude",
  (44.3615 + (random()-0.5)*0.15)::decimal(11,8) as "anonymizedLongitude",
  ARRAY['JavaScript', 'React', 'Node.js']::text[] as skills,
  ARRAY['Arabic', 'English']::text[] as languages,
  ARRAY['full-time', 'part-time'][floor(random()*2)::int+1] as "jobType",
  ARRAY['Entry', 'Mid', 'Senior'][floor(random()*3)::int+1] as "experienceLevel",
  floor(random()*30)::int as "applicantsCount",
  true as "isActive",
  NOW() - (random()*30)::text::interval as "createdAt",
  NOW() as "updatedAt"
FROM generate_series(1, 45)

UNION ALL

-- Basra (35 jobs in Basra area - southern port city)
SELECT
  gen_random_uuid() as id,
  gen_random_uuid() as "companyId",
  ARRAY['Senior React Developer', 'Backend Engineer', 'DevOps Specialist', 'Product Manager', 'Data Scientist'][floor(random()*5)::int+1] as title,
  'Opportunity in Basra - petroleum and port hub' as description,
  ARRAY['IT', 'Design', 'Finance', 'Sales', 'Operations'][floor(random()*5)::int+1] as category,
  1500000::decimal as "salaryMin",
  4500000::decimal as "salaryMax",
  'IQD' as "salaryCurrency",
  'Basra' as governorate,
  'Port Area' as district,
  ARRAY['Ashar', 'Corniche', 'Abu Flous'][floor(random()*3)::int+1] as neighborhood,
  (30.5085 + (random()-0.5)*0.12)::decimal(10,8) as "realLatitude",
  (47.8089 + (random()-0.5)*0.12)::decimal(11,8) as "realLongitude",
  (30.5085 + (random()-0.5)*0.12)::decimal(10,8) as "anonymizedLatitude",
  (47.8089 + (random()-0.5)*0.12)::decimal(11,8) as "anonymizedLongitude",
  ARRAY['Java', 'Python', 'SQL']::text[] as skills,
  ARRAY['Arabic', 'English']::text[] as languages,
  ARRAY['full-time', 'contract'][floor(random()*2)::int+1] as "jobType",
  ARRAY['Mid', 'Senior'][floor(random()*2)::int+1] as "experienceLevel",
  floor(random()*25)::int as "applicantsCount",
  true as "isActive",
  NOW() - (random()*30)::text::interval as "createdAt",
  NOW() as "updatedAt"
FROM generate_series(1, 35)

UNION ALL

-- Erbil (40 jobs in Erbil - Kurdistan region)
SELECT
  gen_random_uuid() as id,
  gen_random_uuid() as "companyId",
  ARRAY['Senior React Developer', 'Backend Engineer', 'DevOps Specialist', 'Product Manager', 'Data Scientist'][floor(random()*5)::int+1] as title,
  'Job opportunity in Erbil - tech hub in Kurdistan' as description,
  ARRAY['IT', 'Design', 'Marketing', 'HR'][floor(random()*4)::int+1] as category,
  2500000::decimal as "salaryMin",
  6000000::decimal as "salaryMax",
  'IQD' as "salaryCurrency",
  'Erbil' as governorate,
  'City Center' as district,
  ARRAY['100-Meter', 'Gulan', 'Ankawa'][floor(random()*3)::int+1] as neighborhood,
  (36.1912 + (random()-0.5)*0.12)::decimal(10,8) as "realLatitude",
  (44.0055 + (random()-0.5)*0.12)::decimal(11,8) as "realLongitude",
  (36.1912 + (random()-0.5)*0.12)::decimal(10,8) as "anonymizedLatitude",
  (44.0055 + (random()-0.5)*0.12)::decimal(11,8) as "anonymizedLongitude",
  ARRAY['JavaScript', 'TypeScript', 'React']::text[] as skills,
  ARRAY['Arabic', 'Kurdish', 'English']::text[] as languages,
  ARRAY['full-time', 'remote'][floor(random()*2)::int+1] as "jobType",
  ARRAY['Entry', 'Mid', 'Senior'][floor(random()*3)::int+1] as "experienceLevel",
  floor(random()*35)::int as "applicantsCount",
  true as "isActive",
  NOW() - (random()*30)::text::interval as "createdAt",
  NOW() as "updatedAt"
FROM generate_series(1, 40)

UNION ALL

-- Mosul (30 jobs in Mosul - northern city, recovering)
SELECT
  gen_random_uuid() as id,
  gen_random_uuid() as "companyId",
  ARRAY['Senior React Developer', 'Backend Engineer', 'DevOps Specialist', 'Product Manager', 'QA Engineer'][floor(random()*5)::int+1] as title,
  'Rebuild job opportunity in Mosul' as description,
  ARRAY['IT', 'Construction', 'Sales', 'HR'][floor(random()*4)::int+1] as category,
  1000000::decimal as "salaryMin",
  3500000::decimal as "salaryMax",
  'IQD' as "salaryCurrency",
  'Nineveh' as governorate,
  'Mosul' as district,
  ARRAY['Al-Noor', 'Al-Shifa', 'Hay Al-Mansour'][floor(random()*3)::int+1] as neighborhood,
  (36.3378 + (random()-0.5)*0.10)::decimal(10,8) as "realLatitude",
  (43.1577 + (random()-0.5)*0.10)::decimal(11,8) as "realLongitude",
  (36.3378 + (random()-0.5)*0.10)::decimal(10,8) as "anonymizedLatitude",
  (43.1577 + (random()-0.5)*0.10)::decimal(11,8) as "anonymizedLongitude",
  ARRAY['JavaScript', 'PHP', 'MySQL']::text[] as skills,
  ARRAY['Arabic', 'English']::text[] as languages,
  'full-time' as "jobType",
  ARRAY['Entry', 'Mid'][floor(random()*2)::int+1] as "experienceLevel",
  floor(random()*20)::int as "applicantsCount",
  true as "isActive",
  NOW() - (random()*30)::text::interval as "createdAt",
  NOW() as "updatedAt"
FROM generate_series(1, 30);

-- 3. Verify Iraq data inserted
SELECT 
  'Total Jobs' as metric,
  COUNT(*) as count
FROM jobs
UNION ALL
SELECT 
  governorate as metric,
  COUNT(*) as count
FROM jobs
GROUP BY governorate
ORDER BY metric;

-- 4. Test clustering at different zoom levels
-- Zoom 7: Wide view (entire Iraq visible)
SELECT 
  COUNT(*) as "Total Jobs",
  COUNT(DISTINCT governorate) as "Governorates",
  MIN("anonymizedLatitude") as "Min Lat",
  MAX("anonymizedLatitude") as "Max Lat",
  MIN("anonymizedLongitude") as "Min Lng",
  MAX("anonymizedLongitude") as "Max Lng"
FROM jobs
WHERE "anonymizedLatitude" BETWEEN 28.0 AND 38.0
  AND "anonymizedLongitude" BETWEEN 39.0 AND 48.0;

-- 5. Test Baghdad cluster (tight bounds)
SELECT 
  COUNT(*) as "Baghdad Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Cluster Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Cluster Center Lng",
  ROUND(MIN("anonymizedLatitude")::numeric, 6) as "South",
  ROUND(MAX("anonymizedLatitude")::numeric, 6) as "North",
  ROUND(MIN("anonymizedLongitude")::numeric, 6) as "West",
  ROUND(MAX("anonymizedLongitude")::numeric, 6) as "East"
FROM jobs
WHERE governorate = 'Baghdad';

-- 6. Test Basra cluster
SELECT 
  COUNT(*) as "Basra Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Cluster Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Cluster Center Lng",
  ROUND(MIN("anonymizedLatitude")::numeric, 6) as "South",
  ROUND(MAX("anonymizedLatitude")::numeric, 6) as "North",
  ROUND(MIN("anonymizedLongitude")::numeric, 6) as "West",
  ROUND(MAX("anonymizedLongitude")::numeric, 6) as "East"
FROM jobs
WHERE governorate = 'Basra';

-- 7. Test Erbil cluster
SELECT 
  COUNT(*) as "Erbil Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Cluster Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Cluster Center Lng",
  ROUND(MIN("anonymizedLatitude")::numeric, 6) as "South",
  ROUND(MAX("anonymizedLatitude")::numeric, 6) as "North",
  ROUND(MIN("anonymizedLongitude")::numeric, 6) as "West",
  ROUND(MAX("anonymizedLongitude")::numeric, 6) as "East"
FROM jobs
WHERE governorate = 'Erbil';

-- 8. Verify data distribution (should be ~4 clusters)
SELECT 
  governorate,
  COUNT(*) as count,
  ROUND(AVG("anonymizedLatitude")::numeric, 4) as avg_lat,
  ROUND(AVG("anonymizedLongitude")::numeric, 4) as avg_lng,
  ROUND((MAX("anonymizedLatitude") - MIN("anonymizedLatitude"))::numeric, 4) as lat_spread,
  ROUND((MAX("anonymizedLongitude") - MIN("anonymizedLongitude"))::numeric, 4) as lng_spread
FROM jobs
GROUP BY governorate
ORDER BY count DESC;

-- 9. Test API response with real data
SELECT 
  COUNT(*) as jobs_in_bounds,
  ROUND(AVG("salaryMin")::numeric, 0) as avg_salary_min,
  ROUND(AVG("salaryMax")::numeric, 0) as avg_salary_max
FROM jobs
WHERE "anonymizedLatitude" BETWEEN 32.0 AND 34.5
  AND "anonymizedLongitude" BETWEEN 43.0 AND 45.0
  AND "isActive" = true;

-- 10. Final validation
SELECT 
  'Jobs Inserted' as validation,
  COUNT(*) as value
FROM jobs
UNION ALL
SELECT 
  'Active Jobs',
  COUNT(*)
FROM jobs WHERE "isActive" = true
UNION ALL
SELECT
  'Iraq Coverage',
  COUNT(DISTINCT governorate)
FROM jobs;
