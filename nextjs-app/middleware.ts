// middleware.ts — Edge Middleware Route Guard (Modul 6)
// Memvalidasi cookie projectmatch_session sebelum request mencapai segmen terlindungi (/dashboard, /admin)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('projectmatch_session')?.value;

  // Proteksi rute /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Jika belum ada cookie sesi, redirect ke login
    if (!sessionCookie) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Proteksi rute /admin (khusus role ADMIN)
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
