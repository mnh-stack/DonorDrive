import React from 'react';
import { useHistory } from 'react-router-dom';

const stats = [
  { label: 'Total Campaigns', value: 12, icon: '📢', color: '#8b5cf6' },
  { label: 'Active Users', value: 87, icon: '👥', color: '#3b82f6' },
  { label: 'Funds Raised', value: '$120K', icon: '💰', color: '#10b981' },
  { label: 'Pending Reviews', value: 3, icon: '📝', color: '#ec4899' },
];

const OwnerDashboard: React.FC = () => {
  const history = useHistory();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0',
      animation: 'fadeInBg 1.2s',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 8px 32px #8b5cf655',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        maxWidth: 520,
        width: '100%',
        marginBottom: 32,
        textAlign: 'center',
        animation: 'fadeInDown 0.8s',
      }}>
        <h1 style={{
          fontSize: 34,
          fontWeight: 900,
          background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10,
          letterSpacing: 1,
        }}>Welcome, Owner</h1>
        <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 18 }}>
          Manage campaigns, review organizations, and oversee platform activity.
        </p>
        <button
          onClick={() => history.push('/campaign/edit/1')}
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 18,
            padding: '0.9rem 2.2rem',
            marginTop: 10,
            marginRight: 16,
            boxShadow: '0 2px 12px #8b5cf655',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            outline: 'none',
            animation: 'bounce 1.2s',
            display: 'inline-block',
          }}
        >
          Edit Campaign
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('owner_id');
            localStorage.removeItem('owner_username');
            history.push('/owner-logout');
          }}
          style={{
            background: 'linear-gradient(90deg, #ec4899, #f59e42)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 18,
            padding: '0.9rem 2.2rem',
            marginTop: 10,
            boxShadow: '0 2px 12px #ec489955',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            outline: 'none',
            animation: 'bounce 1.2s',
            display: 'inline-block',
          }}
        >
          Logout
        </button>
      </div>
      <div style={{
        display: 'flex',
        gap: 28,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
      }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              background: `linear-gradient(135deg, white, ${stat.color}10)`,
              borderRadius: 18,
              boxShadow: '0 4px 18px ' + stat.color + '22',
              padding: '1.5rem 2.2rem',
              minWidth: 170,
              textAlign: 'center',
              margin: '0.5rem 0',
              animation: `fadeInUp 0.7s ${i * 0.12 + 0.2}s both`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8, filter: 'drop-shadow(0 2px 6px ' + stat.color + '44)' }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, marginBottom: 2 }}>{stat.value}</div>
            <div style={{ fontSize: 15, color: '#6b7280', fontWeight: 600 }}>{stat.label}</div>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: 6,
              background: `linear-gradient(90deg, ${stat.color}33, ${stat.color})`,
              borderTopLeftRadius: 18, borderTopRightRadius: 18,
              opacity: 0.18,
            }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
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

export default OwnerDashboard; 