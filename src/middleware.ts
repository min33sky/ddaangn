import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // 로그인 했을 경우에만 존재함 ( "next-auth.session-token" 쿠키가 존재할 때 )
  const session = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;

  console.log('[Middleware Session........]: ', session);

  const search = decodeURIComponent(req.nextUrl.search);

  // 로그인되어 있는 유저가 로그인 페이지 갈 경우 리다이렉트
  if (pathname.startsWith('/auth/signin')) {
    if (session) {
      console.log('미들웨어에서 리다이렉트합니다.........');
      return NextResponse.redirect(new URL('/', search.split('=/')[1]));
    }
  }
}

export const config = {
  matcher: ['/auth/signin'],
};
