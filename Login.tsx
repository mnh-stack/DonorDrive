import React, { useState } from 'react';
import './Register.css';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaBookOpen } from 'react-icons/fa';
import { FaQuoteLeft } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const quotes = [
  {
    text: '"The smallest act of kindness is worth more than the grandest intention."',
    author: 'Oscar Wilde',
  },
  {
    text: '"No one has ever become poor by giving."',
    author: 'Anne Frank',
  },
  {
    text: '"We make a living by what we get, but we make a life by what we give."',
    author: 'Winston Churchill',
  },
  {
    text: '"Giving is not just about making a donation. It is about making a difference."',
    author: 'Kathy Calvin',
  },
  {
    text: '"Together, we make a difference."',
    author: 'DonorDrive',
  },
];

const facts = [
  '🌍 DonorDrive supports 1000+ campaigns worldwide.',
  '💙 Every donation counts, no matter the size.',
  '🚀 Real-time impact tracking for all users.',
  '🔒 Secure & trusted platform for your giving.',
  '🤝 Join a community of changemakers!',
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const history = useHistory();

  // Cycle quotes every 7 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % quotes.length);
      setFactIdx((i) => (i + 1) % facts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save user_type and id for later use
        localStorage.setItem('user_type', data.user_type);
        localStorage.setItem('user_id', data.id);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => history.push('/dashboard'), 1200);
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg login-flex-wrap">
      {/* Animated Sidebar */}
      <aside className="login-side-animated">
        <div className="login-blood-3d">
          {/* 3D Blood Donation SVG */}
          <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bloodDropGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="40%">
                <stop offset="0%" stopColor="#ffb3b3"/>
                <stop offset="80%" stopColor="#e11d48"/>
                <stop offset="100%" stopColor="#991b1b"/>
              </radialGradient>
              <filter id="dropShadow" x="-10" y="-10" width="100" height="100" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#e11d48" floodOpacity="0.25"/>
              </filter>
            </defs>
            <ellipse cx="40" cy="70" rx="18" ry="7" fill="#e11d48" opacity="0.18"/>
            <path d="M40 10C40 10 18 38 18 52C18 66 62 66 62 52C62 38 40 10 40 10Z" fill="url(#bloodDropGradient)" filter="url(#dropShadow)"/>
            <ellipse cx="36" cy="38" rx="4" ry="7" fill="#fff" opacity="0.18"/>
            <ellipse cx="48" cy="44" rx="2.5" ry="4" fill="#fff" opacity="0.12"/>
          </svg>
        </div>
        <div className="login-quote-box">
          {FaQuoteLeft({ className: "login-quote-icon" })}
          <div className="login-quote-text">{quotes[quoteIdx].text}</div>
          <div className="login-quote-author">— {quotes[quoteIdx].author}</div>
        </div>
        <div className="login-fact-box">
          {FaBookOpen({ className: "login-fact-icon" })}
          <div className="login-fact-text">{facts[factIdx]}</div>
        </div>
        <div className="login-side-brand">DonorDrive <span role="img" aria-label="heart">💙</span></div>
      </aside>
      {/* Login Form */}
      <form className="login-form-animated" onSubmit={handleSubmit} autoComplete="off">
        <h2>Login</h2>
        <div className="form-group">
          <label>Email</label>
          <div className="input-icon">{FaEnvelope({})}<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-icon">{FaLock({})}
            <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required minLength={6} />
            <span className="toggle-password" onClick={() => setShowPassword(v => !v)}>{showPassword ? FaEyeSlash({}) : FaEye({})}</span>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <button type="submit" className="register-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#64748b' }}>Don't have an account? </span>
          <a href="/register" style={{ color: '#8b5cf6', textDecoration: 'underline', fontWeight: 600 }}>Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;