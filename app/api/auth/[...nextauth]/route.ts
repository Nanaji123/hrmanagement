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
          console.log('DEBUG authorize: credentials', credentials);
          if (!credentials?.email || !credentials?.password || !credentials?.role) {
            console.log('DEBUG authorize: missing fields');
            return null;
          }
          const validRoles = ['interviewer', 'hr_recruiter', 'hr_manager'];
          if (!validRoles.includes(credentials.role)) {
            console.log('DEBUG authorize: invalid role', credentials.role);
            return null;
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          console.log('DEBUG authorize: user from db', user);
          if (!user) {
            console.log('DEBUG authorize: no user found');
            return null;
          }
          if (user.role !== credentials.role) {
            console.log('DEBUG authorize: role mismatch', user.role, credentials.role);
            return null;
          }
          const isPasswordValid = await compare(credentials.password, user.password);
          console.log('DEBUG authorize: password valid?', isPasswordValid);
          if (!isPasswordValid) {
            console.log('DEBUG authorize: invalid password');
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorize error:', error);
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
        session.user.id = token.id;
        session.user.role = token.role;
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
