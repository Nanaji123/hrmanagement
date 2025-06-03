import { useSession } from 'next-auth/react';

export function useAuthFetch() {
  const { data: session } = useSession();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!session?.user?.id) {
      throw new Error('Not authenticated');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${session.user.id}`,
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