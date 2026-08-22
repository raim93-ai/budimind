import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function generateToken(payload: object): Promise<string> {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    console.log('verifyToken - JWT_SECRET present:', !!JWT_SECRET, 'length:', JWT_SECRET?.length);
    console.log('verifyToken - token length:', token.length);
    
    const { payload } = await jwtVerify(token, secretKey);
    console.log('verifyToken - success:', !!payload);
    return payload;
  } catch (error) {
    console.log('verifyToken error:', error instanceof Error ? error.message : error);
    return null;
  }
}