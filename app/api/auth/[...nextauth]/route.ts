// /app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.role) {
            return null;
          }
          const validRoles = ['interviewer', 'hr_recruiter', 'hr_manager'];
          if (!validRoles.includes(credentials.role)) {
            return null;
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            return null;
          }
          if (user.role !== credentials.role) {
            return null;
          }
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            return null;
          }
          // Call backend login endpoint to get JWT and user info
          const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              role: credentials.role,
            }),
          });
          const data = await response.json();
          if (!response.ok) return null;
          const result = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            jwt: data.token || data.jwt,
          };
          return result;
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        if (user.jwt) token.jwt = user.jwt;
      }
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        if (existingUser) {
          token.role = existingUser.role;
          token.id = existingUser.id;
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: token.email!,
              name: token.name!,
              role: 'interviewer',
              password: '',
            },
          });
          token.role = newUser.role;
          token.id = newUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        if (token.jwt) (session.user as any).jwt = token.jwt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
