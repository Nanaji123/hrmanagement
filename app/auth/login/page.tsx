'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDashboardUrl } from '@/lib/redirects';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('interviewer');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const callbackUrl = searchParams.get('callbackUrl') || getDashboardUrl(role);

    const res = await signIn('credentials', {
      email,
      password,
      role,
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.refresh();
      router.push(res?.url || getDashboardUrl(role));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050d25] to-[#0d1021] text-white">
      <div className="bg-[#0e101c] p-10 rounded-3xl shadow-[0_0_40px_#00f7ff30] w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/Nextindia_logo.png"
            alt="Company Logo"
            width={220}
            height={225}
            className="drop-shadow-[0_0_15px_#00f7ff] neon-logo"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in to your account</h1>
        <p className="text-sm text-[#9aa0b4] mb-6">Share your collections to contracts</p>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-sm mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1c2e] border border-[#2e314d] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1c2e] border border-[#2e314d] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1c2e] border border-[#2e314d] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
            >
              <option value="interviewer">Interviewer</option>
              <option value="hr_recruiter">HR Recruiter</option>
              <option value="hr_manager">HR Manager</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="text-right text-xs mb-4 text-cyan-300 hover:underline cursor-pointer">
            Forgot password?
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold py-2 px-4 rounded-xl shadow-[0_0_15px_#00f7ff80] transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
