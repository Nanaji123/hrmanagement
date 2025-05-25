'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'hr_manager' | 'hr_recruiter' | 'interviewer' | ''>('');
  const [loginError, setLoginError] = useState<boolean>(false);

  const validCredentials = {
    hr_manager: { email: 'manager@example.com', password: 'managerpass', path: '/dashboard/hiring_manager' },
    hr_recruiter: { email: 'recruiter@example.com', password: 'recruiterpass', path: '/dashboard/HR_RECRUiTER' },
    interviewer: { email: 'interviewer@example.com', password: 'interviewerpass', path: '/dashboard/interviewer' }
  };

  const handleLogin = () => {
    // Check if a role is selected
    if (role === '') {
      setLoginError(true);
      return;
    }
    
    // Find the correct role based on the selected value
    const selectedRoleData = validCredentials[role];

    if (selectedRoleData && email === selectedRoleData.email && password === selectedRoleData.password) {
      setLoginError(false);
      router.push(selectedRoleData.path);
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      {/* Left Section: Login Form */}
      <div className={styles.leftSection}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Login to your account.</p>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>E-mail Address</label>
              <input type="email" id="email" name="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input type="password" id="password" name="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>

            {/* Role Dropdown */}
            <div className={styles.inputGroup}>
              <label htmlFor="role" className={styles.label}>Role</label>
              <select id="role" className={styles.select} value={role} onChange={(e) => setRole(e.target.value as 'hr_manager' | 'hr_recruiter' | 'interviewer' | '')}>
                <option value="">Select Role</option>
                <option value="hr_manager">HR Manager</option>
                <option value="hr_recruiter">HR Recruiter</option>
                <option value="interviewer">Interviewer</option>
              </select>
            </div>

            {loginError && <p style={{ color: 'red', marginBottom: '1em' }}>Invalid email, password, or role.</p>}

            <div className={styles.optionsContainer}>
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className={styles.resetPasswordLink}>Reset Password?</a>
            </div>

            <button className={styles.signInButton} type="submit">Sign In</button>
          </form>

          <p className={styles.signUpText}>
            Please contact your administrator to create an account.
          </p>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className={styles.rightSection} style={{ backgroundImage: 'url("/images/image1.png")' }}>
        {/* Text overlay on image */}
      </div>
    </div>
  );
};

export default LoginPage;
