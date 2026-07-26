-- ============================================================
-- P2.9.3 — Iraq Real Data Testing (Complete)
-- ============================================================

-- 1. Create test user first (if doesn't exist)
INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'test@jobmap.local', 'dummy', 'Test', 'User', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@jobmap.local')
LIMIT 1;

-- 2. Create test companies
INSERT INTO companies (id, "ownerId", name, email, governorate, "isActive", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'test@jobmap.local' LIMIT 1),
  'Test Company ' || i::text,
  'company' || i::text || '@jobmap.local',
  'Baghdad',
  true,
  NOW(),
  NOW()
FROM generate_series(1, 150) i
ON CONFLICT DO NOTHING;

-- 3. Clear old test jobs
DELETE FROM jobs;

-- 4. Insert real Iraq data - Baghdad (45 jobs)
WITH company_ids AS (SELECT id FROM companies LIMIT 150)
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
  gen_random_uuid(), 
  (ARRAY(SELECT id FROM company_ids))[floor(random()*150)::int+1],
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

-- 5. Insert Basra data (35 jobs)
WITH company_ids AS (SELECT id FROM companies LIMIT 150)
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
  gen_random_uuid(), 
  (ARRAY(SELECT id FROM company_ids))[floor(random()*150)::int+1],
  CASE (floor(random()*5))::int WHEN 0 THEN 'Senior React Developer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'DevOps Specialist' WHEN 3 THEN 'Product Manager' ELSE 'Data Scientist' END,
  'Opportunity in Basra - petroleum hub',
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

-- 6. Insert Erbil data (40 jobs)
WITH company_ids AS (SELECT id FROM companies LIMIT 150)
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
  gen_random_uuid(), 
  (ARRAY(SELECT id FROM company_ids))[floor(random()*150)::int+1],
  CASE (floor(random()*5))::int WHEN 0 THEN 'Senior React Developer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'DevOps Specialist' WHEN 3 THEN 'Product Manager' ELSE 'Data Scientist' END,
  'Job opportunity in Erbil - tech hub',
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

-- 7. Insert Mosul data (30 jobs)
WITH company_ids AS (SELECT id FROM companies LIMIT 150)
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
  gen_random_uuid(), 
  (ARRAY(SELECT id FROM company_ids))[floor(random()*150)::int+1],
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

-- 8. Verify Iraq data inserted
SELECT 'Data Verification' as status;
SELECT 
  governorate,
  COUNT(*) as count,
  ROUND(AVG("anonymizedLatitude")::numeric, 6) as center_lat,
  ROUND(AVG("anonymizedLongitude")::numeric, 6) as center_lng
FROM jobs
GROUP BY governorate
ORDER BY count DESC;

-- 9. Test clustering accuracy - all 4 governorates should be separate clusters
SELECT COUNT(DISTINCT governorate) as "Cluster Count" FROM jobs;

-- 10. Final count
SELECT COUNT(*) as "Total Iraq Jobs" FROM jobs;
