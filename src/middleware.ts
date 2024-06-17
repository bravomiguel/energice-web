import NextAuth from "next-auth";
// import { NextResponse } from "next/server";

import { nextAuthEdgeConfig } from "./lib/auth-edge";
// import { auth } from "./lib/auth";

export default NextAuth(nextAuthEdgeConfig).auth;

// export function middleware(request: Request) {
//   console.log(request.url);
//   return NextResponse.next();
// }

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
