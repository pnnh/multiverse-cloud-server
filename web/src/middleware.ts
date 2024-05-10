import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    const requestHeaders = new Headers(request.headers);
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    requestHeaders.set('x-url', request.url);
    requestHeaders.set('x-origin', origin);
    requestHeaders.set('x-pathname', pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
}