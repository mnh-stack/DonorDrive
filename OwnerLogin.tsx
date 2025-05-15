import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const OwnerLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('owner_id', data.owner_id);
        localStorage.setItem('owner_username', data.username);
        history.push('/owner-dashboard'); // Redirect to owner dashboard
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #8b5cf655', padding: '2.5rem 2.2rem', maxWidth: 380, width: '100%', animation: 'fadeInDown 0.7s' }}>
        <h2 style={{ color: '#8b5cf6', textAlign: 'center', fontWeight: 800, fontSize: 28, marginBottom: 18, letterSpacing: 1, background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Owner Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {error && <div className="form-error" style={{ color: '#dc2626', background: '#fee2e2', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600, textAlign: 'center' }}>{error}</div>}
        <button type="submit" className="register-btn" disabled={loading} style={{ width: '100%', borderRadius: 8, fontWeight: 700, fontSize: 17, padding: '0.9rem 0', marginTop: 10, background: loading ? '#a5b4fc' : '#8b5cf6', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 2px 8px #8b5cf655', transition: 'background 0.2s, box-shadow 0.2s' }}>{loading ? 'Logging in...' : 'Login as Owner'}</button>
        <style>{`
          @keyframes fadeInDown {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </form>
    </div>
  );
};

export default OwnerLogin; 