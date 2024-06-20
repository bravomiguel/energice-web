import NextAuth, { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { nextAuthEdgeConfig } from './auth-edge';
import { signinSchema, signupSchema } from './validations';
import { getUserByEmail } from './server-utils';

const config = {
  ...nextAuthEdgeConfig,
  providers: [
    credentials({
      async authorize(credentials) {
        console.log({ credentials });

        // runs on signin
        const validatedCredentials = signinSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validatedCredentials.success) {
          console.log(validatedCredentials.error.issues[0].message);
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
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
