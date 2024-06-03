// import NextAuth, { NextAuthConfig } from 'next-auth';
// import credentials from 'next-auth/providers/credentials';
// import prisma from './db';
// import bcrypt from 'bcryptjs';

// const config = {
//   pages: {
//     signIn: '/login',
//   },
//   // default settings below
//   // session: {
//   //   maxAge: 30 * 24 * 60 * 60,
//   //   strategy: "jwt",
//   // },
//   providers: [
//     credentials({
//       async authorize(credentials) {
//         // runs on login
//         const { email, password } = credentials;

//         const user = await prisma.user.findUnique({
//           where: {
//             email,
//           },
//         });

//         if (!user) {
//           console.log('No user found');
//           return null;
//         }

//         const passwordsMatch = await bcrypt.compare(
//           password,
//           user.hashedPassword,
//         );

//         if (!passwordsMatch) {
//           console.log('Invalid credentials');
//           return null;
//         }

//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     authorized: ({ auth, request }) => {
//       // runs on every request with middleware
//       const isLoggedIn = Boolean(auth?.user);
//       const isTryingToAccessApp = request.nextUrl.pathname.includes('/app');

//       if (!isLoggedIn && isTryingToAccessApp) return false;

//       if (isLoggedIn && isTryingToAccessApp) return true;

//       if (isLoggedIn && !isTryingToAccessApp) return Response.redirect(new URL('/app/dashboard', request.nextUrl));

//       if (!isLoggedIn && !isTryingToAccessApp) return true;

//       return false;
//     },
//   },
// } satisfies NextAuthConfig;

// export const { auth, signIn, signOut } = NextAuth(config);