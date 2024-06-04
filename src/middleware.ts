// import { auth } from "./lib/auth";

// import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth;

// export function middleware(request: Request) {
//   console.log(request.url);
//   return NextResponse.next();
// }

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
