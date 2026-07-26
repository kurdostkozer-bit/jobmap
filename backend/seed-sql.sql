-- Disable foreign key checks temporarily
ALTER TABLE jobs DISABLE TRIGGER ALL;

-- Insert test jobs without company references (simplified)
-- We'll directly insert jobs with anonymized coordinates

INSERT INTO jobs (
  id, "companyId", title, description, category, 
  "salaryMin", "salaryMax", "salaryCurrency", 
  governorate, district,
  "realLatitude", "realLongitude", 
  "anonymizedLatitude", "anonymizedLongitude",
  skills, languages, "jobType", "experienceLevel",
  "applicantsCount", "isActive", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid() as id,
  gen_random_uuid() as "companyId",
  'Senior React Developer' as title,
  'Exciting opportunity for a talented professional.' as description,
  'IT' as category,
  1500000::decimal as "salaryMin",
  3500000::decimal as "salaryMax",
  'IQD' as "salaryCurrency",
  CASE floor(random() * 3)::int WHEN 0 THEN 'Baghdad' WHEN 1 THEN 'Basra' ELSE 'Nineveh' END as governorate,
  'Test District' as district,
  (33.3136 + (random() - 0.5) * 2)::decimal(10,8) as "realLatitude",
  (44.3615 + (random() - 0.5) * 2)::decimal(11,8) as "realLongitude",
  (33.3136 + (random() - 0.5) * 2)::decimal(10,8) as "anonymizedLatitude",
  (44.3615 + (random() - 0.5) * 2)::decimal(11,8) as "anonymizedLongitude",
  ARRAY['JavaScript', 'React', 'Node.js']::text[] as skills,
  ARRAY['Arabic', 'English']::text[] as languages,
  CASE floor(random() * 4)::int WHEN 0 THEN 'full-time' WHEN 1 THEN 'part-time' WHEN 2 THEN 'contract' ELSE 'freelance' END as "jobType",
  CASE floor(random() * 3)::int WHEN 0 THEN 'Entry' WHEN 1 THEN 'Mid' ELSE 'Senior' END as "experienceLevel",
  floor(random() * 50)::int as "applicantsCount",
  true as "isActive",
  NOW() - (random() * 30)::text::interval as "createdAt",
  NOW() as "updatedAt"
FROM generate_series(1, 450);  -- 450 jobs total (150 each location)

-- Re-enable foreign key checks
ALTER TABLE jobs ENABLE TRIGGER ALL;

-- Verify data
SELECT COUNT(*) as total_jobs FROM jobs;
SELECT governorate, COUNT(*) as count FROM jobs GROUP BY governorate;
