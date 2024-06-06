import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  // this is for frontend purposes only

  // const { pathname } = request.nextUrl;

  // // Check if the current path is excluded using negative lookahead regex
  // if (pathname === '/sign-up' || pathname === '/sign-in') {
  //   return NextResponse.next();
  // }

  // if (pathname.startsWith('/api')) {
  //   return NextResponse.next();
  // }

  // let cookie = request.cookies.get('accessToken');
  // const url = request.nextUrl.clone();
  // url.pathname = '/';
  // if (!cookie?.value) {
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:path*'] // Matches all routes
};
