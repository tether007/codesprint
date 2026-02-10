// Tis utility func is for auth tasks
// 1. JWT token creation
// 2. verifying with JWT_SECRET
// 3. Get which user is making the request
// 4. set the auth cookie(session management)
// 5. clear cookie


import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET 
);

// Creation of JWT token
export async function createToken(userId: number): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })// can use SHA256 (i mean if more secure required)
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number };
  } catch (error) {
    return null;
  }
}

// Getin the user from request
export async function getUserFromRequest(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  return payload;// contains the info abt the session
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
