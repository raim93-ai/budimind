import { SignJWT, jwtVerify } from 'jose';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const secretKey = new TextEncoder().encode(JWT_SECRET);

export type UserRole = 'consultant' | 'company_admin' | 'client';

export const ROLE_HOME: Record<UserRole, string> = {
  consultant: '/dashboard',
  company_admin: '/portal/company',
  client: '/portal/me',
};

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt');
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hashed);
}

export async function generateToken(payload: object): Promise<string> {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Unified user model (migration 002). Falls back to legacy consultants table
// for accounts that have not yet been mirrored into users.
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: number;          // users.id
  email: string;
  fullName: string;
  role: UserRole;
  companyId?: number | null;
  patientId?: number | null; // linked patients.id for clients
}

export async function findUserByEmail(email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = @email').get({ email }) as {
    id: number;
    email: string;
    password_hash: string;
    full_name: string;
    role: UserRole;
    company_id: number | null;
    is_active: number;
  } | undefined;
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  companyId?: number | null,
) {
  const db = getDb();
  const passwordHash = await hashPassword(password);
  const result = db.prepare(`
    INSERT INTO users (email, password_hash, full_name, role, company_id)
    VALUES (@email, @passwordHash, @fullName, @role, @companyId)
  `).run({ email, passwordHash, fullName, role, companyId: companyId ?? null });
  return result.lastInsertRowid as number;
}

/**
 * Validate credentials against the unified users table.
 * Back-compat: consultant accounts that exist only in the legacy
 * consultants table are validated there and transparently mirrored
 * into users on first successful login.
 */
export async function validateCredentials(email: string, password: string): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);

  if (user) {
    if (!user.is_active) return null;
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return null;

    let patientId: number | null = null;
    if (user.role === 'client') {
      const p = getDb().prepare('SELECT id FROM patients WHERE user_id = ?').get(user.id) as { id: number } | undefined;
      patientId = p?.id ?? null;
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      companyId: user.company_id,
      patientId,
    };
  }

  // Legacy fallback: consultants table only
  const legacy = await validateConsultantCredentials(email, password);
  if (!legacy) return null;

  // Mirror into users for future logins
  const newId = await createUser(legacy.email, password, legacy.full_name, 'consultant');
  return { id: newId, email: legacy.email, fullName: legacy.full_name, role: 'consultant', companyId: null, patientId: null };
}

// --- Legacy helpers (still used by existing routes during migration) ---

export async function createConsultant(email: string, password: string, fullName: string) {
  const userId = await createUser(email, password, fullName, 'consultant');
  const db = getDb();
  const passwordHash = await hashPassword(password);
  db.prepare(`
    INSERT INTO consultants (email, password_hash, full_name)
    VALUES (@email, @passwordHash, @fullName)
  `).run({ email, passwordHash, fullName });
  return userId;
}

export async function findConsultantByEmail(email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM consultants WHERE email = @email').get({ email }) as {
    id: number;
    email: string;
    password_hash: string;
    full_name: string;
  } | undefined;
}

export async function validateConsultantCredentials(email: string, password: string) {
  const consultant = await findConsultantByEmail(email);
  if (!consultant) return null;

  const isValid = await comparePassword(password, consultant.password_hash);
  return isValid ? consultant : null;
}
