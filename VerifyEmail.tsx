import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Register.css';

const getTokenFromQuery = (search: string) => {
  const params = new URLSearchParams(search);
  return params.get('token');
};

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<'loading'|'success'|'already'|'invalid'|'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = getTokenFromQuery(location.search);
    if (!token) {
      setStatus('invalid');
      setMessage('Invalid or missing verification token.');
      return;
    }
    fetch(`/api/verify-email?token=${token}`)
      .then(async res => {
        const text = await res.text();
        if (res.ok) {
          if (text.includes('Email Verified!')) {
            setStatus('success');
            setMessage('Your email has been successfully verified! You can now log in.');
          } else if (text.includes('Email Already Verified')) {
            setStatus('already');
            setMessage('Your email has already been verified. You can log in.');
          } else {
            setStatus('success');
            setMessage('Your email has been verified!');
          }
        } else {
          if (text.includes('Invalid') || text.includes('expired')) {
            setStatus('invalid');
            setMessage('This verification link is invalid or has already been used.');
          } else {
            setStatus('error');
            setMessage('Something went wrong. Please try again later.');
          }
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
      });
  }, [location.search]);

  return (
    <div className="register-page">
      <div className="register-form" style={{ maxWidth: 420, minHeight: 260, justifyContent: 'center' }}>
        {status === 'loading' ? (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem', width: 48, height: 48, border: '6px solid #e0e7ff', borderTop: '6px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: '#334155', fontWeight: 600 }}>{message}</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h2 style={{ color: status === 'success' ? '#16a34a' : status === 'already' ? '#3b82f6' : '#dc2626', fontWeight: 800, marginBottom: 12 }}>
              {status === 'success' && 'Email Verified!'}
              {status === 'already' && 'Already Verified'}
              {status === 'invalid' && 'Invalid Link'}
              {status === 'error' && 'Error'}
            </h2>
            <div style={{ color: '#334155', fontWeight: 500, fontSize: 18 }}>{message}</div>
            <div style={{ marginTop: 24 }}>
              <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: 600 }}>Go to Home</a>
              <span style={{ margin: '0 8px' }}>|</span>
              <a href="/register" style={{ color: '#8b5cf6', textDecoration: 'underline', fontWeight: 600 }}>Register</a>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default VerifyEmail; 