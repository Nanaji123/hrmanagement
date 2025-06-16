import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

// Define valid roles
export const VALID_ROLES = ['interviewer', 'hr_recruiter', 'hr_manager'] as const;
export type UserRole = typeof VALID_ROLES[number];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter all required fields');
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
        if (!response.ok) throw new Error(data.error || 'Login failed');
        // data.token or data.jwt should be the JWT string returned by your backend
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          jwt: data.token, // always use data.token as backend returns JWT as 'token'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = (user as any).jwt; // store JWT in token, cast as any
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            role: token.role,
            id: token.id,
            jwt: token.jwt, // expose JWT to session if needed
          },
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false,
};