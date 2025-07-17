import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
  '/profile(.*)',
  '/chat(.*)',
  '/explore(.*)',
  '/reels(.*)',
  '/events(.*)',
  '/channels(.*)',
  '/bookmarks(.*)',
  '/liverooms(.*)',
  '/dasboard(.*)',
]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/registration(.*)',
  '/auth-check(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { redirectToSignIn, userId } = await auth();
  const { pathname } = req.nextUrl;

  // Allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return;
  }

  // Allow public routes to pass through for everyone
  if (isPublicRoute(req)) {
    return;
  }

  // If user is authenticated and trying to access sign-in/sign-up, redirect to auth-check
  if (userId && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    const authCheckUrl = new URL('/auth-check', req.url);
    return Response.redirect(authCheckUrl);
  }

  // If user is not authenticated and trying to access protected routes, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Allow all other requests to pass through
  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}