// 'use server';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
// import postgres from 'postgres';
import { z } from 'zod';
import prisma from '@/lib/database/prisma/prisma';
import { authConfig } from './auth.config';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<typeof prisma.user | undefined> {
  try {
    const user = await prisma.user.findMany({
      where: { email: email,
        deletedAt: null,
      },
    });
    // sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        // username: { label: "Username" },
        email: { label: "E-mail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        console.log('reached here now 123');
        const parsedCredentials = z
          .object({ 
            email: z.string(), // .email(),
            password: z.string().min(6) 
          }).safeParse(credentials);

        console.log('Parsed credentials:', parsedCredentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log('did reach here 456');
          if (!user) return null;
          console.log('reached here 7890') // user.email, user.password);
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials. Hashes don\'t match.');
        return null;
      },
    }),
  ],
});
