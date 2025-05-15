import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const OwnerLogout: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    // Clear any owner data just in case
    localStorage.removeItem('owner_id');
    localStorage.removeItem('owner_username');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeInBg 1.2s',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 24,
        boxShadow: '0 8px 32px #8b5cf655',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        animation: 'fadeInDown 0.8s',
      }}>
        <div style={{ fontSize: 60, marginBottom: 18, color: '#8b5cf6', filter: 'drop-shadow(0 2px 8px #8b5cf655)' }}>👋</div>
        <h1 style={{
          fontSize: 30,
          fontWeight: 900,
          background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10,
          letterSpacing: 1,
        }}>You have been logged out</h1>
        <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 24 }}>
          Thank you for managing DonorDrive. See you again soon!
        </p>
        <button
          onClick={() => history.push('/')}
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 18,
            padding: '0.9rem 2.2rem',
            marginTop: 10,
            boxShadow: '0 2px 12px #8b5cf655',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            outline: 'none',
            animation: 'bounce 1.2s',
          }}
        >
          Return to Home
        </button>
      </div>
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInBg {
          0% { background: #fff; }
          100% { background: linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default OwnerLogout; 