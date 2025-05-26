'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page with the callback URL
    const callbackUrl = encodeURIComponent('http://localhost:3000/dashboard/interviewer');
    router.push(`/auth/login?callbackUrl=${callbackUrl}`);
  }, [router]);

  return null;
}



































































































