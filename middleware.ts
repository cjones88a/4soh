import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Intentionally no-op; headers will be set via next.config.js for simplicity
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
