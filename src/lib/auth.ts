import NextAuth, { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import prisma from './db';
import bcrypt from 'bcryptjs';
import { authFormSchema } from './validations';
import { getUserByEmail } from './server-utils';

const config = {
  pages: {
    signIn: '/signup',
  },
  // default settings below
  // session: {
  //   maxAge: 30 * 24 * 60 * 60,
  //   strategy: "jwt",
  // },
  providers: [
    credentials({
      async authorize(credentials) {
        // runs on signin
        const validatedCredentials = authFormSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;

        const user = await getUserByEmail(email);

        if (!user) {
          console.log('No user found');
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword,
        );

        if (!passwordsMatch) {
          console.log('Invalid credentials');
          return null;
        }

        return user;
      },
    }),
  ],
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
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
