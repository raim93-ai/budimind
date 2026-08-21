-- ============================================================================
-- Migration: Assessment Trends (Time-Series Tracking)
-- Adds longitudinal tracking of assessment dimension scores over time
-- ============================================================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- assessment_trends table
-- Tracks individual dimension scores over time for trend visualization
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_trends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  assessment_type TEXT NOT NULL,
  assessment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  dimension TEXT NOT NULL,        -- e.g., 'depression', 'anxiety', 'stress', 'well-being'
  score REAL NOT NULL,            -- 0-100 normalized score
  severity_level TEXT,            -- e.g., 'normal', 'mild', 'moderate', 'severe', 'extreme'
  raw_score REAL,                 -- Unnormalized raw subscale score (for reference)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_assessment_trends_patient_id ON assessment_trends(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessment_trends_patient_date ON assessment_trends(patient_id, assessment_date);
CREATE INDEX IF NOT EXISTS idx_assessment_trends_company_id ON assessment_trends(company_id);
CREATE INDEX IF NOT EXISTS idx_assessment_trends_type_dim ON assessment_trends(assessment_type, dimension);
CREATE INDEX IF NOT EXISTS idx_assessment_trends_created_at ON assessment_trends(created_at);

-- ============================================================================
-- assessment_assignments table
-- Tracks assessment assignments to patients (for assignment/reminder features)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  assessment_type TEXT NOT NULL,
  assigned_by INTEGER REFERENCES consultants(id), -- consultant who assigned
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at DATETIME
);

-- Indexes for assignments
CREATE INDEX IF NOT EXISTS idx_assessments_assign_patient ON assessment_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_assign_company ON assessment_assignments(company_id);
CREATE INDEX IF NOT EXISTS idx_assessments_assign_type ON assessment_assignments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_assign_assigned_at ON assessment_assignments(assigned_at);

-- ============================================================================
-- audit_log table
-- HIPAA-compliant audit trail of all actions on PHI
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,          -- consultant or system user
  user_type TEXT,           -- 'consultant', 'admin', 'system'
  action TEXT NOT NULL,      -- 'view', 'create', 'update', 'delete', 'login', 'logout'
  resource_type TEXT NOT NULL, -- 'patient', 'assessment', 'company', 'user'
  resource_id INTEGER,      -- ID of the affected resource
  ip_address TEXT,
  user_agent TEXT,
  details TEXT,             -- JSON with additional context
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- ============================================================================
-- Migration trigger: Auto-populate trend data when assessments are submitted
-- ============================================================================
-- This trigger inserts dimension scores into assessment_trends when a new
-- assessment response is submitted, enabling longitudinal tracking.
CREATE TRIGGER IF NOT EXISTS trg_assessment_response_after_insert
AFTER INSERT ON assessment_responses
BEGIN
  INSERT INTO assessment_trends (
    patient_id,
    assessment_type,
    assessment_date,
    dimension,
    score,
    severity_level,
    raw_score
  )
  SELECT
    NEW.patient_id,
    NEW.assessment_type,
    NEW.completed_at,
    key AS dimension,
    value AS score,
    NEW.severity,
    NULL AS raw_score
  FROM json_each(NEW.raw_scores)
  WHERE json_type(NEW.raw_scores, key) = 'real'
     OR json_type(NEW.raw_scores, key) = 'integer';
END;