import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Consultant auth helpers
export async function createConsultant(email: string, password: string, fullName: string) {
  const db = getDb();
  const passwordHash = await hashPassword(password);
  
  const result = db.prepare(`
    INSERT INTO consultants (email, password_hash, full_name)
    VALUES (@email, @passwordHash, @fullName)
  `).run({
    email,
    passwordHash: passwordHash,
    fullName: fullName
  });
  
  return result.lastInsertRowid;
}

export async function findConsultantByEmail(email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM consultants WHERE email = @email').get({ email });
}

export async function validateConsultantCredentials(email: string, password: string) {
  const consultant = await findConsultantByEmail(email);
  if (!consultant) return null;
  
  const isValid = await comparePassword(password, consultant.password_hash);
  return isValid ? consultant : null;
}