import NextAuth, { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import prisma from './db';
import bcrypt from 'bcryptjs';
import { authFormSchema } from './validations';

const config = {
  pages: {
    signIn: '/signup',
    // signOut: '/signIn',
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
          console.log('Invalid email and/or password');
          return null;
        }

        const { email, password } = validatedCredentials.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
            deleted: false,
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
    authorized: async ({ auth, request }) => {
      // runs on every request with middleware
      const isSignedIn = Boolean(auth?.user);
      const isTryingToAccessAuth =
        request.nextUrl.pathname.includes('/signin') ||
        request.nextUrl.pathname.includes('/signup');
      // const user = await prisma.user.findUnique({
      //   where: { email: auth?.user?.email ?? undefined },
      //   select: { firstName: true, isWaiverSigned: true },
      // });
      // const isMemberInfoComplete = Boolean(user?.firstName);
      // const isWaiverSigned = Boolean(user?.isWaiverSigned);

      // if (isSignedIn && !isMemberInfoComplete)
      //   return Response.redirect(new URL('/member-info', request.nextUrl));

      // if (isSignedIn && !isWaiverSigned)
      //   return Response.redirect(new URL('/waiver', request.nextUrl));

      if (isSignedIn && isTryingToAccessAuth)
        return Response.redirect(new URL('/', request.nextUrl));

      if (isSignedIn) return true;

      if (!isSignedIn && isTryingToAccessAuth) return true;

      if (!isSignedIn) return false;

      return false;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
