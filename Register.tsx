import React, { useState } from 'react';
import './Register.css';
import { FaLock, FaUser, FaEnvelope, FaUsers, FaEye, FaEyeSlash, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram, FaHome, FaInfoCircle, FaPhone } from 'react-icons/fa';

const initialState = {
  name: '',
  email: '',
  password: '',
  user_type: 'individual',
  terms: false,
};

const passwordStrength = (password: string) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '', user_type: '', terms: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Valid email is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (!form.terms) return 'You must agree to the terms.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({ name: '', email: '', password: '', user_type: '', terms: '' });
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          user_type: form.user_type,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        setForm(initialState);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      } else {
        setError(data.error || 'Registration failed.');
        if (data.error) {
          if (data.error.toLowerCase().includes('name')) setFieldErrors((prev) => ({ ...prev, name: data.error }));
          if (data.error.toLowerCase().includes('email')) setFieldErrors((prev) => ({ ...prev, email: data.error }));
          if (data.error.toLowerCase().includes('password')) setFieldErrors((prev) => ({ ...prev, password: data.error }));
          if (data.error.toLowerCase().includes('user type')) setFieldErrors((prev) => ({ ...prev, user_type: data.error }));
          if (data.error.toLowerCase().includes('terms')) setFieldErrors((prev) => ({ ...prev, terms: data.error }));
        }
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#dc2626', '#f59e42', '#3b82f6', '#16a34a'];

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <div className="logo-circle"><span role="img" aria-label="blue heart">💙</span></div>
        <div>
          <h1>DonorDrive</h1>
          <p className="tagline">Empowering Generosity, One Click at a Time</p>
        </div>
      </header>
      {/* Progress Bar */}
      <div className="register-progress"><div className="register-progress-bar" /></div>
      <div className="register-content">
        {/* Sidebar */}
        <aside className="register-sider">
          <h3>{FaUsers({ style: { color: '#3b82f6', marginRight: 8 } })}Join a Giving Community</h3>
          <ul>
            <li>{FaCheckCircle({ className: 'sider-icon' })} 1000+ campaigns launched</li>
            <li>{FaCheckCircle({ className: 'sider-icon' })} Secure & trusted platform</li>
            <li>{FaCheckCircle({ className: 'sider-icon' })} Real-time impact tracking</li>
          </ul>
          <div className="mission">“Together, we make a difference.”</div>
        </aside>
        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
          <h2>Sign Up</h2>
          <div className="form-group">
            <label>Name</label>
            <div className="input-icon">{FaUser({})}<input type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" required /></div>
            {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">{FaEnvelope({})}<input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required /></div>
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-icon">
              {FaLock({})}
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required minLength={6} />
              <span className="toggle-password" onClick={() => setShowPassword(v => !v)}>{showPassword ? FaEyeSlash({}) : FaEye({})}</span>
            </div>
            <div className="password-strength">
              <div className="strength-bar" style={{ width: `${(strength/3)*100}%`, background: strengthColors[strength-1] || '#e5e7eb' }} />
              <span className="strength-label" style={{ color: strengthColors[strength-1] || '#64748b' }}>{form.password && strengthLabels[strength-1]}</span>
            </div>
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
          </div>
          <div className="form-group">
            <label>User Type</label>
            <select name="user_type" value={form.user_type} onChange={handleChange} required>
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
            {fieldErrors.user_type && <div className="form-error">{fieldErrors.user_type}</div>}
          </div>
          <div className="form-group terms">
            <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} id="terms" />
            <label htmlFor="terms">I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a></label>
            {fieldErrors.terms && <div className="form-error">{fieldErrors.terms}</div>}
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <button type="submit" className="register-btn" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        {/* Confetti Animation */}
        {confetti && <div className="confetti"><span role="img" aria-label="confetti">🎉🎊✨</span></div>}
      </div>
      {/* Footer */}
      <footer className="register-footer">
        <div className="footer-links">
          <a href="/" className="footer-link">{FaHome({})} Home</a>
          <a href="/about" className="footer-link">{FaInfoCircle({})} About</a>
          <a href="/contact" className="footer-link">{FaPhone({})} Contact</a>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">{FaFacebook({})}</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">{FaTwitter({})}</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">{FaInstagram({})}</a>
        </div>
      </footer>
    </div>
  );
};

export default Register; 