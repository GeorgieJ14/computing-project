import type { NextAuthConfig } from 'next-auth';
/* import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/database/prisma/prisma" */

export const authConfig = {
  pages: {
    signIn: '/',
  },
  // adapter: PrismaAdapter(prisma),
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      console.log('auth.config.ts - signIn - User signed in:', user, account, profile, email, credentials);
      return true; // Allow sign-in
    },
    authorized({ auth, request: { nextUrl } }) {
      // console.log('auth.config.ts - callback - Checking authorization...');
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
