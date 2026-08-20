-- ============================================================================
-- Budimind Database Seed Data
-- Run after schema.sql
-- ============================================================================

-- ============================================================================
-- Demo Consultant (password: password123)
-- bcrypt hash of 'password123' with cost 10
-- ============================================================================
INSERT OR IGNORE INTO consultants (email, password_hash, full_name) VALUES 
  ('consultant@budimind.com', '$2b$10$wIjF7H4PBi3Do7iJFXBsxem8OXeHariX8JGDofen6S8uxhQxxzzCa', 'Dr. Sarah Chen');

-- ============================================================================
-- Demo Companies
-- ============================================================================
INSERT OR IGNORE INTO companies (id, name) VALUES 
  (1, 'Budimind Psychology Clinic'),
  (2, 'Greenfield Mental Health Center'),
  (3, 'Sunrise Wellness Group'),
  (4, 'Harborview Counseling Services');

-- ============================================================================
-- Demo Patients
-- ============================================================================
INSERT OR IGNORE INTO patients (id, full_name, ic_number, email, age, gender, phone, company_id) VALUES 
  (1, 'Ahmad bin Hassan', '900115-10-1234', 'ahmad.hassan@email.com', 34, 'male', '+60 12-345 6789', 1),
  (2, 'Siti Aisyah', '920523-08-5678', 'siti.aisyah@email.com', 31, 'female', '+60 17-987 6543', 1),
  (3, 'Chen Wei Ming', '880912-14-9012', 'chen.weiming@email.com', 36, 'male', '+60 19-234 5678', 2),
  (4, 'Priya Sharma', '950307-06-3456', 'priya.sharma@email.com', 29, 'female', '+60 11-876 5432', 3),
  (5, 'Mohd Faizal', '850719-04-7890', 'mohd.faizal@email.com', 39, 'male', '+60 13-555 1234', 4),
  (6, 'Tan Mei Ling', '930228-07-2468', 'tan.meiling@email.com', 31, 'female', '+60 16-777 8888', 1),
  (7, 'Rajesh Kumar', '890105-10-1357', 'rajesh.kumar@email.com', 35, 'male', '+60 18-999 0000', 2),
  (8, 'Nurul Huda', '961112-08-8642', 'nurul.huda@email.com', 27, 'female', '+60 14-444 5555', NULL);

-- ============================================================================
-- Demo Assessment Responses
-- Some completed assessments for the demo patients
-- ============================================================================

-- Patient 1: DASS-21 (moderate depression, mild anxiety, moderate stress)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (1, 'dass21', 
   '[1,1,2,0,2,1,1,2,0,2,1,1,2,1,0,2,2,1,0,1,2]',
   '{"total":56,"depression":16,"anxiety":8,"stress":20,"severity":"moderate","interpretation":"Depression: 16/42, Anxiety: 8/42, Stress: 20/42. Moderate severity."}',
   'moderate',
   '2026-08-10 14:30:00');

-- Patient 1: PHQ-9 (moderate depression)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (1, 'phq9', 
   '[2,2,1,2,1,2,1,1,0]',
   '{"total":12,"severity":"moderate","interpretation":"Moderate depression (Score: 12/27)"}',
   'moderate',
   '2026-08-12 10:15:00');

-- Patient 2: GAD-7 (mild anxiety)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (2, 'gad7', 
   '[1,1,2,1,0,1,1]',
   '{"total":7,"severity":"mild","interpretation":"Mild anxiety (Score: 7/21)"}',
   'mild',
   '2026-08-11 16:45:00');

-- Patient 2: WHO-5 (moderate well-being)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (2, 'who5', 
   '[3,2,3,2,3]',
   '{"total":13,"percentage":52,"severity":"moderate well-being","interpretation":"Well-being score: 52/100 (raw: 13/25). Moderate well-being."}',
   'moderate well-being',
   '2026-08-13 09:30:00');

-- Patient 3: PCL-5 (subclinical PTSD symptoms)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (3, 'pcl5', 
   '[1,0,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,0,0,1]',
   '{"total":22,"intrusion":3,"avoidance":1,"cognition":4,"arousal":4,"severity":"mild","interpretation":"Total: 22/80. Mild PTSD symptoms. Clusters - Intrusion: 3/20, Avoidance: 1/8, Cognition/Mood: 4/28, Arousal: 4/24."}',
   'mild',
   '2026-08-09 11:20:00');

-- Patient 3: PHQ-9 (mild depression)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (3, 'phq9', 
   '[1,1,1,1,0,1,0,1,0]',
   '{"total":6,"severity":"mild","interpretation":"Mild depression (Score: 6/27)"}',
   'mild',
   '2026-08-14 13:10:00');

-- Patient 4: EPDS (possible depression)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (4, 'epds', 
   '[2,2,1,2,1,2,1,2,1,0]',
   '{"total":14,"severity":"probable major depression","interpretation":"Score: 14/30. Probable major depression. Score ≥10 suggests possible depression; ≥13 suggests probable major depression."}',
   'probable major depression',
   '2026-08-15 10:00:00');

-- Patient 4: GAD-7 (moderate anxiety)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (4, 'gad7', 
   '[2,2,2,2,1,2,2]',
   '{"total":13,"severity":"moderate","interpretation":"Moderate anxiety (Score: 13/21)"}',
   'moderate',
   '2026-08-16 14:20:00');

-- Patient 5: K10 (mild mental disorder likely)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (5, 'k10', 
   '[2,2,1,2,2,1,2,2,1,1]',
   '{"total":16,"severity":"likely well","interpretation":"Score: 16/40. Likely well."}',
   'likely well',
   '2026-08-08 15:30:00');

-- Patient 6: ISI (subthreshold insomnia)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (6, 'isi', 
   '[1,2,1,2,1,1,1]',
   '{"total":9,"severity":"subthreshold insomnia","interpretation":"Score: 9/28. Subthreshold insomnia."}',
   'subthreshold insomnia',
   '2026-08-12 20:00:00');

-- Patient 7: ASRS (possible ADHD)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (7, 'asrs', 
   '[2,3,2,2,1,1]',
   '{"total":11,"partAScore":3,"severity":"possible ADHD","interpretation":"Part A positive responses: 3/6. Possible ADHD. Score ≥4 on Part A suggests ADHD."}',
   'possible ADHD',
   '2026-08-13 16:40:00');

-- Patient 8: Y-BOCS (subclinical OCD)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (8, 'ybocs', 
   '[1,1,1,0,1,1,0,1,0,1]',
   '{"total":7,"obsessionSubscale":4,"compulsionSubscale":3,"severity":"subclinical","interpretation":"Total: 7/40. Subclinical OCD. Obsessions: 4/20, Compulsions: 3/20."}',
   'subclinical',
   '2026-08-14 11:30:00');

-- Patient 1: Recent DASS-21 (for dashboard recent assessments)
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (1, 'dass21', 
   '[0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0,0,0,1]',
   '{"total":22,"depression":6,"anxiety":4,"stress":12,"severity":"mild","interpretation":"Depression: 6/42, Anxiety: 4/42, Stress: 12/42. Mild severity."}',
   'mild',
   '2026-08-17 09:00:00');

-- Patient 2: Recent PHQ-9
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (2, 'phq9', 
   '[1,1,0,1,0,1,0,0,0]',
   '{"total":4,"severity":"minimal","interpretation":"Minimal or no depression (Score: 4/27)"}',
   'minimal',
   '2026-08-17 14:00:00');

-- Patient 3: Recent GAD-7
INSERT OR IGNORE INTO assessment_responses (patient_id, assessment_type, responses, raw_scores, severity, completed_at) VALUES 
  (3, 'gad7', 
   '[0,1,1,0,0,0,1]',
   '{"total":3,"severity":"minimal","interpretation":"Minimal anxiety (Score: 3/21)"}',
   'minimal',
   '2026-08-17 16:30:00');

-- ============================================================================
-- End of seed data
-- ============================================================================