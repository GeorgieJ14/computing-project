import type { NextAuthConfig } from 'next-auth';
/* import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/database/prisma/prisma" */

export const authConfig = {
  pages: {
    signIn: '/',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User signed in!", user);
    },
    async session({ session, token }) {
      console.log("Session updated!", session);
      console.log(token);
      // You can add custom session handling logic here if needed
      return session;
    }
  },
  session: {
    strategy: 'jwt', // 'database' | 'jwt'
  },
  cookies: {
    sessionToken: {
      name: 'authjs.session-token', // Cookie name for session token
      options: {
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : 'lax', // Allows cookies to be sent across different origins
      }
    },
    csrfToken: {
      name: 'authjs.csrf-token', // Cookie name for CSRF token
      options: {
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : 'lax', // Allows cookies to be sent across different origins
      },
    },
    callbackUrl: {
      name: 'authjs.callback-url', // Cookie name for callback URL
      options: {
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : 'lax', // Allows cookies to be sent across different origins
      },
    },
  },
  debug: true,
  // adapter: PrismaAdapter(prisma),
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    /* signIn({ user, account, profile, email, credentials }) {
      console.log('auth.config.ts - signIn - User signed in:', user, account, profile, email, credentials);
      return true; // Allow sign-in
    }, */
    async authorized({ request, auth }) {
      // console.log('auth.config.ts - callback - Checking authorization...');
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }
      return true;
    },
    /* jwt: async ({ token, user }) => {
      // console.log('auth.config.ts - jwt - Token:', token, 'User:', user);
      if (user) {
        // If user exists, add user information to the token
        token.user = user;
      }
      return token;
    } */
  },
} satisfies NextAuthConfig;
