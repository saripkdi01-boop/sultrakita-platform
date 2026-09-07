import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = randomBytes(32).toString('hex');
  const response = NextResponse.json({ csrfToken: token }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set('suki_csrf', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 });
  return response;
}
