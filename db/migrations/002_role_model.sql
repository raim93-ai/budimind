-- Migration 002: Unified role-based user model
-- Adds `users` table (one auth identity per person) with role column,
-- plus company_admins and client linkage. Existing tables are preserved;
-- consultants remain as practitioner profile records linked to users.

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('consultant', 'company_admin', 'client')),
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL, -- for company_admin/client
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);

-- Link clients (users with role='client') to the legacy patients table
-- so all existing assessment_responses keep working unchanged.
ALTER TABLE patients ADD COLUMN user_id INTEGER REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);

-- Seed existing consultant into users (password123, same hash as seed.sql)
INSERT OR IGNORE INTO users (email, password_hash, full_name, role)
VALUES ('consultant@budimind.com', '$2b$10$wIjF7H4PBi3Do7iJFXBsxem8OXeHariX8JGDofen6S8uxhQxxCa', 'Dr. Sarah Chen', 'consultant');

CREATE TRIGGER IF NOT EXISTS update_users_timestamp
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
