import { SignJWT, jwtVerify } from 'jose';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const secretKey = new TextEncoder().encode(JWT_SECRET);

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