import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { VALID_ROLES } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isRootPage = request.nextUrl.pathname === '/';

  // Handle root page redirect
  if (isRootPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // If authenticated, redirect to appropriate dashboard
    const role = token.role?.toLowerCase();
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/auth/error?error=Invalid+role', request.url));
    }
    const roleToPath: Record<string, string> = {
      interviewer: '/dashboard/interviewer',
      hr_recruiter: '/dashboard/HR_RECRUiTER',
      hr_manager: '/dashboard/hiring_manager'
    };
    return NextResponse.redirect(new URL(roleToPath[role] || '/dashboard', request.url));
  }

  // Handle auth pages
  if (isAuthPage) {
    if (token) {
      // If user is already authenticated, redirect to their dashboard
      const role = token.role?.toLowerCase();
      if (!role || !VALID_ROLES.includes(role)) {
        return NextResponse.redirect(new URL('/auth/error?error=Invalid+role', request.url));
      }

      const roleToPath: Record<string, string> = {
        interviewer: '/dashboard/interviewer',
        hr_recruiter: '/dashboard/HR_RECRUiTER',
        hr_manager: '/dashboard/hiring_manager'
      };

      return NextResponse.redirect(new URL(roleToPath[role] || '/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const role = token.role?.toLowerCase();
  const path = request.nextUrl.pathname;

  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.redirect(new URL('/auth/error?error=Invalid+role', request.url));
  }

  // Map paths to required roles
  const pathToRole: Record<string, string> = {
    '/dashboard/interviewer': 'interviewer',
    '/dashboard/HR_RECRUiTER': 'hr_recruiter',
    '/dashboard/hiring_manager': 'hr_manager'
  };

  // Check if the current path requires a specific role
  for (const [pathPrefix, requiredRole] of Object.entries(pathToRole)) {
    if (path.startsWith(pathPrefix) && role !== requiredRole) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}; 