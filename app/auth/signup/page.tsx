import React from 'react';
import styles from './signup.module.css';

const SignupPage = () => {
  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      {/* Left Section: Image Panel */}
      <div className={styles.leftSection} style={{ backgroundImage: 'url("/images/image.png")' }}>
        {/* Text overlay on image */}
        <div className={styles.imageTextOverlay}>
           <h1 className={styles.imageMainText}>HR Management Platform</h1>
           <p className={styles.imageDescription}>Manage all employees, payrolls, and other human resource operations.</p>
           <div className={styles.imageButtons}>
             <button className={styles.learnMoreButton}>Learn More</button>
             <button className={styles.ourFeaturesButton}>Our Features</button>
           </div>
        </div>
      </div>

      {/* Right Section: Signup Form */}
      <div className={styles.rightSection}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Welcome to NestIndia</h1>
          <p className={styles.subtitle}>Register your account</p>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.label}>First Name</label>
              <input type="text" id="firstName" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.label}>Last Name</label>
              <input type="text" id="lastName" className={styles.input} />
            </div>
          </div>

          <div className={styles.inputRow}>
             <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>E-mail Address</label>
                <input type="email" id="email" className={styles.input} />
             </div>
             <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input type="text" id="phone" className={styles.input} />
             </div>
          </div>

          <div className={styles.inputRow}>
             <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input type="password" id="password" className={styles.input} />
             </div>
             <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input type="password" id="confirmPassword" className={styles.input} />
             </div>
          </div>

           <div className={styles.checkboxGroup}>
            <input type="checkbox" id="terms" className={styles.checkbox} />
            <label htmlFor="terms" className={styles.checkboxLabel}>I agree to all the <a href="#">Terms, Privacy Policy</a></label>
          </div>

          <button className={styles.createAccountButton}>Create Account</button>

          <p className={styles.loginLinkText}>
            Already have an account? <a href="/auth/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 