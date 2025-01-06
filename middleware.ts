import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith('/ipfs/')) {
    url.protocol = 'http';
    url.hostname = '8.219.11.39';
    url.port = '8080';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
