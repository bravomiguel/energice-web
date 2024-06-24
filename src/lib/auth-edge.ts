import { NextAuthConfig } from 'next-auth';

export const nextAuthEdgeConfig = {
  pages: {
    signIn: '/signup',
  },
  // default settings below
  // session: {
  //   maxAge: 30 * 24 * 60 * 60,
  //   strategy: "jwt",
  // },
  callbacks: {
    authorized: async ({ auth, request }) => {
      // runs on every request with middleware
      const isSignedIn = Boolean(auth?.user);
      const isTryingToAccessAuth =
        request.nextUrl.pathname.includes('/signin') ||
        request.nextUrl.pathname.includes('/signup');

      if (isSignedIn && isTryingToAccessAuth)
        return Response.redirect(new URL('/', request.nextUrl));

      if (isSignedIn) return true;

      if (!isSignedIn && isTryingToAccessAuth) return true;

      if (!isSignedIn) return false;

      return false;
    },
    jwt: ({ token, user }) => {
      if (user && user.id) {
        // on sign in
        token.userId = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
