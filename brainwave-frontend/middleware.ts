// middleware.ts (at the root of your project)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes should be protected
export const config = {
  matcher: ['/dashboard/:path*', '/inference/:path*'], // Add any routes that need authentication
};

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  // If there's no token, redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token, allow the request to continue
  return NextResponse.next();
}