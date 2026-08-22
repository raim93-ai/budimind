-- Migration 003: Corporate invites + assessment assignments
-- Powers corporate onboarding (invite codes) and the assignment engine
-- (consultants/company admins assign assessments to clients/workers).

CREATE TABLE IF NOT EXISTS company_invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'company_admin')),
  created_by INTEGER REFERENCES users(id),
  is_active INTEGER NOT NULL DEFAULT 1,
  used_by INTEGER REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_company_invites_code ON company_invites(code);
CREATE INDEX IF NOT EXISTS idx_company_invites_company ON company_invites(company_id);

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  assigned_by INTEGER NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  due_at DATETIME,
  completed_response_id INTEGER REFERENCES assessment_responses(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assignments_client ON assignments(client_user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_company ON assignments(company_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
