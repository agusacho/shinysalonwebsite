import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@insforge/sdk/ssr';

export default async function proxy(request: NextRequest) {
  // updateSession handles refreshing the access token if needed
  // and returning the updated response with cookies.
  return await updateSession(request, {
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
