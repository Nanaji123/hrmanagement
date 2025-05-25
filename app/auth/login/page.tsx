'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

type UserRole = 'hr_manager' | 'hr_recruiter' | 'interviewer';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('interviewer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate callback URL after role state is initialized
  const defaultCallbackUrl = role === 'interviewer' ? '/interviewer/dashboard' : '/dashboard';
  const callbackUrl = searchParams.get('callbackUrl') || defaultCallbackUrl;

  // Update callback URL when role changes
  useEffect(() => {
    const newCallbackUrl = role === 'interviewer' ? '/interviewer/dashboard' : '/dashboard';
    if (searchParams.get('callbackUrl') !== newCallbackUrl) {
      router.replace(`/auth/login?callbackUrl=${newCallbackUrl}`);
    }
  }, [role, router, searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>HR Portal Login</h1>
          <p className={styles.subtitle}>Select your role and sign in to continue</p>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                aria-describedby={error ? "login-error" : undefined}
                autoComplete="username"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                aria-describedby={error ? "login-error" : undefined}
                autoComplete="current-password"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="role">
                Role
              </label>
              <select
                id="role"
                className={styles.input}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                required
                aria-label="Select your role"
              >
                <option value="hr_manager">HR Manager</option>
                <option value="hr_recruiter">HR Recruiter</option>
                <option value="interviewer">Interviewer</option>
              </select>
            </div>
            {error && (
              <div 
                className={styles.errorMessage} 
                id="login-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            <button
              type="submit"
              className={styles.signInButton}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
      <div className={styles.rightSection} />
    </div>
  );
}
