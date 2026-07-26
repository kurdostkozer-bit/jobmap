-- ============================================================
-- P2.9.3 — Iraq Real Data Testing (FIXED)
-- ============================================================

-- 1. Clear test data
DELETE FROM jobs;

-- 2. Insert real Iraq data - Baghdad (45 jobs)
INSERT INTO jobs (
  id, "companyId", title, description, category,
  "salaryMin", "salaryMax", "salaryCurrency",
  governorate, district, neighborhood,
  "realLatitude", "realLongitude",
  "anonymizedLatitude", "anonymizedLongitude",
  skills, languages, "jobType", "experienceLevel",
  "applicantsCount", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), gen_random_uuid(),
  CASE (floor(random()*5))::int WHEN 0 THEN 'Senior React Developer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'DevOps Specialist' WHEN 3 THEN 'Product Manager' ELSE 'Data Scientist' END,
  'Quality job opportunity in Baghdad',
  CASE (floor(random()*4))::int WHEN 0 THEN 'IT' WHEN 1 THEN 'Design' WHEN 2 THEN 'Finance' ELSE 'Sales' END,
  2000000::decimal, 5000000::decimal, 'IQD',
  'Baghdad', 'Downtown',
  CASE (floor(random()*4))::int WHEN 0 THEN 'Karada' WHEN 1 THEN 'Mansour' WHEN 2 THEN 'Jadiriya' ELSE 'Doura' END,
  (33.3128 + (random()-0.5)*0.15)::decimal(10,8),
  (44.3615 + (random()-0.5)*0.15)::decimal(11,8),
  (33.3128 + (random()-0.5)*0.15)::decimal(10,8),
  (44.3615 + (random()-0.5)*0.15)::decimal(11,8),
  ARRAY['JavaScript', 'React', 'Node.js'], ARRAY['Arabic', 'English'],
  CASE (floor(random()*2))::int WHEN 0 THEN 'full-time' ELSE 'part-time' END,
  CASE (floor(random()*3))::int WHEN 0 THEN 'Entry' WHEN 1 THEN 'Mid' ELSE 'Senior' END,
  floor(random()*30)::int, true,
  NOW() - (random()*30)::text::interval, NOW()
FROM generate_series(1, 45);

-- 3. Insert Basra data (35 jobs)
INSERT INTO jobs (
  id, "companyId", title, description, category,
  "salaryMin", "salaryMax", "salaryCurrency",
  governorate, district, neighborhood,
  "realLatitude", "realLongitude",
  "anonymizedLatitude", "anonymizedLongitude",
  skills, languages, "jobType", "experienceLevel",
  "applicantsCount", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), gen_random_uuid(),
  CASE (floor(random()*5))::int WHEN 0 THEN 'Senior React Developer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'DevOps Specialist' WHEN 3 THEN 'Product Manager' ELSE 'Data Scientist' END,
  'Opportunity in Basra - petroleum and port hub',
  CASE (floor(random()*5))::int WHEN 0 THEN 'IT' WHEN 1 THEN 'Design' WHEN 2 THEN 'Finance' WHEN 3 THEN 'Sales' ELSE 'Operations' END,
  1500000::decimal, 4500000::decimal, 'IQD',
  'Basra', 'Port Area',
  CASE (floor(random()*3))::int WHEN 0 THEN 'Ashar' WHEN 1 THEN 'Corniche' ELSE 'Abu Flous' END,
  (30.5085 + (random()-0.5)*0.12)::decimal(10,8),
  (47.8089 + (random()-0.5)*0.12)::decimal(11,8),
  (30.5085 + (random()-0.5)*0.12)::decimal(10,8),
  (47.8089 + (random()-0.5)*0.12)::decimal(11,8),
  ARRAY['Java', 'Python', 'SQL'], ARRAY['Arabic', 'English'],
  CASE (floor(random()*2))::int WHEN 0 THEN 'full-time' ELSE 'contract' END,
  CASE (floor(random()*2))::int WHEN 0 THEN 'Mid' ELSE 'Senior' END,
  floor(random()*25)::int, true,
  NOW() - (random()*30)::text::interval, NOW()
FROM generate_series(1, 35);

-- 4. Insert Erbil data (40 jobs)
INSERT INTO jobs (
  id, "companyId", title, description, category,
  "salaryMin", "salaryMax", "salaryCurrency",
  governorate, district, neighborhood,
  "realLatitude", "realLongitude",
  "anonymizedLatitude", "anonymizedLongitude",
  skills, languages, "jobType", "experienceLevel",
  "applicantsCount", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), gen_random_uuid(),
  CASE (floor(random()*5))::int WHEN 0 THEN 'Senior React Developer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'DevOps Specialist' WHEN 3 THEN 'Product Manager' ELSE 'Data Scientist' END,
  'Job opportunity in Erbil - tech hub in Kurdistan',
  CASE (floor(random()*4))::int WHEN 0 THEN 'IT' WHEN 1 THEN 'Design' WHEN 2 THEN 'Marketing' ELSE 'HR' END,
  2500000::decimal, 6000000::decimal, 'IQD',
  'Erbil', 'City Center',
  CASE (floor(random()*3))::int WHEN 0 THEN '100-Meter' WHEN 1 THEN 'Gulan' ELSE 'Ankawa' END,
  (36.1912 + (random()-0.5)*0.12)::decimal(10,8),
  (44.0055 + (random()-0.5)*0.12)::decimal(11,8),
  (36.1912 + (random()-0.5)*0.12)::decimal(10,8),
  (44.0055 + (random()-0.5)*0.12)::decimal(11,8),
  ARRAY['JavaScript', 'TypeScript', 'React'], ARRAY['Arabic', 'Kurdish', 'English'],
  CASE (floor(random()*2))::int WHEN 0 THEN 'full-time' ELSE 'remote' END,
  CASE (floor(random()*3))::int WHEN 0 THEN 'Entry' WHEN 1 THEN 'Mid' ELSE 'Senior' END,
  floor(random()*35)::int, true,
  NOW() - (random()*30)::text::interval, NOW()
FROM generate_series(1, 40);

-- 5. Insert Mosul data (30 jobs)
INSERT INTO jobs (
  id, "companyId", title, description, category,
  "salaryMin", "salaryMax", "salaryCurrency",
  governorate, district, neighborhood,
  "realLatitude", "realLongitude",
  "anonymizedLatitude", "anonymizedLongitude",
  skills, languages, "jobType", "experienceLevel",
  "applicantsCount", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), gen_random_uuid(),
  CASE (floor(random()*5))::int WHEN 0 THEN 'Senior React Developer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'DevOps Specialist' WHEN 3 THEN 'Product Manager' ELSE 'QA Engineer' END,
  'Rebuild job opportunity in Mosul',
  CASE (floor(random()*4))::int WHEN 0 THEN 'IT' WHEN 1 THEN 'Construction' WHEN 2 THEN 'Sales' ELSE 'HR' END,
  1000000::decimal, 3500000::decimal, 'IQD',
  'Nineveh', 'Mosul',
  CASE (floor(random()*3))::int WHEN 0 THEN 'Al-Noor' WHEN 1 THEN 'Al-Shifa' ELSE 'Hay Al-Mansour' END,
  (36.3378 + (random()-0.5)*0.10)::decimal(10,8),
  (43.1577 + (random()-0.5)*0.10)::decimal(11,8),
  (36.3378 + (random()-0.5)*0.10)::decimal(10,8),
  (43.1577 + (random()-0.5)*0.10)::decimal(11,8),
  ARRAY['JavaScript', 'PHP', 'MySQL'], ARRAY['Arabic', 'English'],
  'full-time',
  CASE (floor(random()*2))::int WHEN 0 THEN 'Entry' ELSE 'Mid' END,
  floor(random()*20)::int, true,
  NOW() - (random()*30)::text::interval, NOW()
FROM generate_series(1, 30);

-- 6. Verify Iraq data
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

-- 7. Test Baghdad cluster
SELECT 
  COUNT(*) as "Baghdad Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Center Lng"
FROM jobs WHERE governorate = 'Baghdad';

-- 8. Test Basra cluster
SELECT 
  COUNT(*) as "Basra Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Center Lng"
FROM jobs WHERE governorate = 'Basra';

-- 9. Test Erbil cluster
SELECT 
  COUNT(*) as "Erbil Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Center Lng"
FROM jobs WHERE governorate = 'Erbil';

-- 10. Test Mosul cluster
SELECT 
  COUNT(*) as "Mosul Jobs",
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as "Center Lat",
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as "Center Lng"
FROM jobs WHERE governorate = 'Nineveh';

-- 11. Distribution summary
SELECT 
  governorate,
  COUNT(*) as count,
  ROUND(AVG("anonymizedLatitude")::numeric, 4) as avg_lat,
  ROUND(AVG("anonymizedLongitude")::numeric, 4) as avg_lng
FROM jobs
GROUP BY governorate
ORDER BY count DESC;

-- 12. All jobs valid
SELECT COUNT(*) as "Total Valid Jobs" FROM jobs WHERE "isActive" = true;
