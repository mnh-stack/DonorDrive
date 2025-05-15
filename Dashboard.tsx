import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const history = useHistory();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)',
      }}
    >
      {/* Background Image with Overlay */}
      <img
        src="/assets/static/dashboard.png"
        alt="Dashboard Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.18,
          filter: 'blur(1.5px) saturate(1.2)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #f3e8ffcc 60%, #e0e7ffcc 100%)',
          zIndex: 1
        }}
      />
      {/* DonorDrive Logo and Animated Heading */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 8, zIndex: 2 }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6 60%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px #8b5cf655',
          marginBottom: 10,
          animation: 'popIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
        }}>
          <span role="img" aria-label="DonorDrive Logo" style={{ fontSize: 40, color: '#fff', filter: 'drop-shadow(0 2px 8px #3b82f655)' }}>💙</span>
        </div>
        <h1 style={{
          color: '#8b5cf6',
          textAlign: 'center',
          fontWeight: 900,
          fontSize: 36,
          letterSpacing: 1,
          margin: 0,
          background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeInDown 0.8s cubic-bezier(.68,-0.55,.27,1.55)'
        }}>
          Welcome to DonorDrive Dashboard
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: 18,
          textAlign: 'center',
          margin: '14px 0 0 0',
          fontWeight: 500,
          lineHeight: 1.6,
          maxWidth: 520,
          animation: 'fadeInUp 1.1s cubic-bezier(.68,-0.55,.27,1.55)'
        }}>
          <b>DonorDrive</b> is your all-in-one platform for launching, managing, and tracking fundraising campaigns.<br />
          Effortlessly manage your profile, create new campaigns, and inspire your community.<br />
          <span style={{ color: '#8b5cf6', fontWeight: 700 }}>Your dashboard</span> is the hub for your fundraising journey—organized, beautiful, and powerful.<br />
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>DonorDrive</span> brings your mission to life with transparency, impact, and innovation.
        </p>
      </div>
      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: 32, zIndex: 2 }}>
        <button
          onClick={() => history.push('/profile')}
          style={{
            padding: '1.2rem 2.2rem',
            fontSize: 18,
            borderRadius: 12,
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 2px 8px #8b5cf655',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
        >
          Profile Management
        </button>
        <button
          onClick={() => history.push('/campaign/create')}
          style={{
            padding: '1.2rem 2.2rem',
            fontSize: 18,
            borderRadius: 12,
            background: '#8b5cf6',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 2px 8px #8b5cf655',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
        >
          + Create Campaign
        </button>
      </div>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 