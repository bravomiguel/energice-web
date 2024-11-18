import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import prisma from './lib/db';

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  const user = await supabase.auth.getUser();

  const isAuthenticated = !user.error;
  const isPhoneConfirmed = !!user.data.user?.phone_confirmed_at;

  const isPKCERoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isSupabaseWhRoute =
    request.nextUrl.pathname.startsWith('/api/supabase');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/signin');
  const isConfirmPhoneRoute =
    request.nextUrl.pathname.startsWith('/confirm-phone');
  const isMemberDetailsRoute =
    request.nextUrl.pathname.startsWith('/member-details');
  const isWaiverRoute = request.nextUrl.pathname.startsWith('/waiver');
  const isProfileRoute = request.nextUrl.pathname.startsWith('/profile');

  // console.log({ isSupabaseWhRoute });

  // Allow PKCE confirmation route without authentication check
  if (isPKCERoute || isSupabaseWhRoute) {
    return response;
  }

  // Redirect to signup if user is not signed in and not on an auth route
  if (!isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to phone confirmation screen if authenticated but phone number is not confirmed (unless navigating to profile screen)
  if (
    isAuthenticated &&
    !isPhoneConfirmed &&
    !isConfirmPhoneRoute &&
    !isProfileRoute
  ) {
    return NextResponse.redirect(new URL('/confirm-phone', request.url));
  }

  // Block /confirm-phone route if phone is already confirmed
  if (isAuthenticated && isPhoneConfirmed && isConfirmPhoneRoute) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to homepage
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
