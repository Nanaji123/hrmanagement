import { useSession } from 'next-auth/react';

// Add a type that includes jwt
interface UserWithJwt {
  id: string;
  role?: string;
  jwt?: string;
  [key: string]: any;
}

export function useAuthFetch() {
  const { data: session } = useSession();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const user = session?.user as UserWithJwt;
    if (!user?.jwt) {
      throw new Error('Not authenticated: JWT missing');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${user.jwt}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  return authFetch;
}