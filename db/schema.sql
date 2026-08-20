-- ============================================================================
-- Budimind Database Schema
-- SQLite compatible
-- ============================================================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- consultants table
-- Stores consultant login credentials
-- ============================================================================
CREATE TABLE IF NOT EXISTS consultants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_consultants_email ON consultants(email);

-- ============================================================================
-- companies table
-- Organizations that patients may belong to
-- ============================================================================
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- patients table
-- Patient demographic information
-- ============================================================================
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  ic_number TEXT UNIQUE,
  email TEXT,
  age INTEGER CHECK (age >= 1 AND age <= 120),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search functionality
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON patients(full_name);
CREATE INDEX IF NOT EXISTS idx_patients_ic_number ON patients(ic_number);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_company_id ON patients(company_id);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

-- ============================================================================
-- assessment_responses table
-- Stores all assessment submissions with responses and scores
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  responses TEXT NOT NULL,        -- JSON array of response values
  raw_scores TEXT NOT NULL,       -- JSON object with computed scores
  severity TEXT,                  -- Calculated severity level
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_assessment_responses_patient_id ON assessment_responses(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_type ON assessment_responses(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_completed_at ON assessment_responses(completed_at);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_patient_type ON assessment_responses(patient_id, assessment_type);

-- ============================================================================
-- Triggers for updated_at timestamps
-- ============================================================================
CREATE TRIGGER IF NOT EXISTS update_consultants_timestamp
AFTER UPDATE ON consultants
BEGIN
  UPDATE consultants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_companies_timestamp
AFTER UPDATE ON companies
BEGIN
  UPDATE companies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_patients_timestamp
AFTER UPDATE ON patients
BEGIN
  UPDATE patients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================================================
-- Views for common queries
-- ============================================================================

-- View: Patient with company name
CREATE VIEW IF NOT EXISTS patients_with_company AS
SELECT p.*, c.name as company_name
FROM patients p
LEFT JOIN companies c ON p.company_id = c.id;

-- View: Assessment responses with patient info
CREATE VIEW IF NOT EXISTS assessments_with_patient AS
SELECT ar.*, p.full_name as patient_name, p.email as patient_email
FROM assessment_responses ar
JOIN patients p ON ar.patient_id = p.id;

-- View: Latest assessment per patient per type
CREATE VIEW IF NOT EXISTS latest_assessments_per_type AS
SELECT ar1.*
FROM assessment_responses ar1
LEFT JOIN assessment_responses ar2
  ON ar1.patient_id = ar2.patient_id
  AND ar1.assessment_type = ar2.assessment_type
  AND ar1.completed_at < ar2.completed_at
WHERE ar2.id IS NULL;

-- ============================================================================
-- End of schema
-- ============================================================================