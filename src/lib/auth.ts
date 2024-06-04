import NextAuth, { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import prisma from './db';
import bcrypt from 'bcryptjs';
import { authFormSchema } from './validations';

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
        // const { email, password } = credentials;
        const validatedCredentials = authFormSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          console.log('Invalid email and/or password');
          return null;
        }

        const { email, password } = validatedCredentials.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

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
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessAuth = request.nextUrl.pathname.includes('/signin') || request.nextUrl.pathname.includes('/signup');

      
      if (isLoggedIn && isTryingToAccessAuth) return Response.redirect(new URL('/', request.nextUrl));

      if (isLoggedIn) return true;

      if (!isLoggedIn && isTryingToAccessAuth) return true;
      
      if (!isLoggedIn) return false;

      return false;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
