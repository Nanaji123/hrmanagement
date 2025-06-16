import 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
    accessToken?: string;
    jwt?: string; // Add jwt property
  }

  interface Session {
    user: User & {
      role: UserRole;
      accessToken?: string;
      jwt?: string; // Add jwt property
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    id: string;
    accessToken?: string;
    jwt?: string; // Add jwt property
  }
}