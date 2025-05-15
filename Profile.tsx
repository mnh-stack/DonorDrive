import React, { useState, useEffect } from 'react';
import './Register.css';
import { Link, useHistory } from 'react-router-dom';

const initialProfile = {
  id: '',
  name: 'Your Name',
  email: 'your@email.com',
  bio: '',
  contact: '',
  photo_url: '',
  visibility: 'public',
  user_type: 'individual',
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [photoPreview, setPhotoPreview] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationBadge, setVerificationBadge] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    const userId = localStorage.getItem('user_id');
    if (userType === 'organization' && userId) {
      fetch(`/api/org-verification/status?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.verification_status === 'unverified' || data.verification_status === 'rejected') {
            setRedirecting(true);
            history.replace('/organization-verification');
          }
        });
    }
  }, [history]);

  useEffect(() => {
    if (profile.user_type === 'organization' && profile.id) {
      fetch(`/api/org-verification/status?user_id=${profile.id}`)
        .then(res => res.json())
        .then(data => {
          setVerificationStatus(data.verification_status);
          setVerificationBadge(data.verification_status === 'verified');
        });
    }
  }, [profile.user_type, profile.id]);

  // Fetch full user profile on mount
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    fetch(`/api/profile?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(prev => ({ ...prev, ...data }));
      });
  }, []);

  if (redirecting) return null;

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!profile.name.trim()) errors.name = 'Name is required.';
    if (!profile.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errors.email = 'Valid email is required.';
    if (profile.contact && !profile.contact.match(/^[0-9+\-()\s]{7,}$/)) errors.contact = 'Enter a valid contact number.';
    if (profile.bio && profile.bio.length > 500) errors.bio = 'Bio must be under 500 characters.';
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, photo_url: file.name }));
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Profile updated!');
      } else {
        setError(data.error || 'Update failed.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setSuccess('Account deleted.');
      // TODO: Call backend to delete account
    }, 1200);
  };

  const handleVerificationFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationFile(e.target.files?.[0] || null);
  };

  const handleVerificationUpload = async () => {
    setVerificationError('');
    setVerificationSuccess('');
    if (!verificationFile) {
      setVerificationError('Please select a document to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('document', verificationFile);
    formData.append('user_id', profile.id); // Make sure profile.id is available
    try {
      const res = await fetch('/api/org-verification/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationSuccess('Document uploaded. Verification pending.');
        setVerificationStatus('pending');
      } else {
        setVerificationError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setVerificationError('Server error. Please try again later.');
    }
  };

  const verificationStatusText =
    verificationStatus === 'pending' ? 'Pending Review'
    : verificationStatus === 'verified' ? 'Verified'
    : verificationStatus === 'rejected' ? 'Rejected'
    : 'Not Submitted';
  const verificationStatusColor =
    verificationStatus === 'pending' ? '#f59e42'
    : verificationStatus === 'verified' ? '#16a34a'
    : verificationStatus === 'rejected' ? '#dc2626'
    : '#64748b';

  return (
    <div
      className="profile-page-bg"
      style={{
        backgroundImage: "url('/assets/static/blood.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflowX: 'hidden',
        padding: 0,
      }}
    >
      <Link
        to="/"
        className="profile-back-btn"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: 'rgba(255,255,255,0.85)',
          color: '#3b82f6',
          fontWeight: 600,
          borderRadius: 30,
          padding: '0.5rem 1.3rem',
          textDecoration: 'none',
          boxShadow: '0 2px 8px #3b82f655',
          zIndex: 10,
        }}
      >
        &larr; Home
      </Link>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          minHeight: '100vh',
        }}
      >
        <form
          className="profile-form-animated"
          onSubmit={handleSave}
          style={{
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 4px 24px 0 rgba(59, 130, 246, 0.10), 0 1.5px 6px #8b5cf633',
            padding: '2.2rem 2.5rem 2.2rem',
            width: 560,
            height: 720,
            minWidth: 0,
            minHeight: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
            alignItems: 'center',
            justifyContent: 'flex-start',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div style={{ width: '100%' }}>
            <h2 className="profile-header" style={{ textAlign: 'center', marginBottom: 10 }}>Profile Management</h2>
          </div>
          <div className="profile-photo-upload" style={{ marginBottom: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
              <div className="profile-photo-circle" style={{ width: 80, height: 80, borderRadius: 8, border: '2.5px solid #8b5cf6', marginBottom: 4, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <span role="img" aria-label="person">👤</span>
                )}
              </div>
              <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              <div className="profile-photo-label" style={{ color: '#3b82f6', fontWeight: 600, fontSize: 14, marginTop: 2, textAlign: 'center' }}>Change Photo</div>
            </label>
          </div>
          <div style={{ width: '100%' }}>
            <div className="form-group" style={{ width: '100%' }}>
              <label>Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} required style={{ width: '100%' }} />
              {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label>Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} required style={{ width: '100%' }} />
              {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label>Bio</label>
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows={3} style={{ resize: 'vertical', width: '100%' }} placeholder="Tell donors about yourself or your organization..." />
              {fieldErrors.bio && <div className="form-error">{fieldErrors.bio}</div>}
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label>Contact Information</label>
              <input type="text" name="contact" value={profile.contact} onChange={handleChange} placeholder="Phone, website, etc." style={{ width: '100%' }} />
              {fieldErrors.contact && <div className="form-error">{fieldErrors.contact}</div>}
            </div>
            <div className="form-group" style={{ width: '100%' }}>
              <label>Profile Visibility</label>
              <select name="visibility" value={profile.visibility} onChange={handleChange} style={{ width: '100%' }}>
                <option value="public">Public (visible to donors)</option>
                <option value="private">Private (hidden from donors)</option>
              </select>
            </div>
            <div style={{ color: profile.visibility === 'public' ? '#16a34a' : '#64748b', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>
              Profile is currently <span style={{ textTransform: 'uppercase' }}>{profile.visibility}</span>
            </div>
            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}
            {profile.user_type === 'organization' && (
              <div style={{ width: '100%', margin: '1.2rem 0', padding: '1rem', background: '#f8fafc', borderRadius: 8, border: '1.5px solid #e0e7ff' }}>
                <h3 style={{ color: '#3b82f6', marginBottom: 8 }}>Organization Verification</h3>
                <div style={{ marginBottom: 6 }}>
                  Status: <span style={{ color: verificationStatusColor }}>{verificationStatusText}</span>
                  {verificationStatus === 'pending' && <span style={{ marginLeft: 8, color: '#f59e42' }}>⏳ Under Review</span>}
                  {verificationStatus === 'verified' && <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 700 }}>✔ Verified</span>}
                  {verificationStatus === 'rejected' && <span style={{ marginLeft: 8, color: '#dc2626' }}>❌ Rejected</span>}
                </div>
                {verificationBadge && (
                  <div style={{ color: '#16a34a', fontWeight: 700, marginTop: 6 }}>Verified Organization Badge</div>
                )}
                <div style={{ marginTop: 8 }}>
                  <Link to="/organization-verification" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: 600 }}>Go to Organization Verification Page</Link>
                </div>
              </div>
            )}
            <button type="submit" className="register-btn" style={{ marginTop: 10, width: '100%', borderRadius: 8, fontWeight: 700, fontSize: 17, padding: '0.9rem 0' }}>Save Changes</button>
            <button type="button" className="register-btn" style={{ background: '#dc2626', marginTop: 16, width: '100%', borderRadius: 8, fontWeight: 700, fontSize: 17, padding: '0.9rem 0' }} onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Account'}</button>
          </div>
        </form>
        <div
          className="profile-side-panel"
          style={{
            background: 'rgba(255,255,255,0.96)',
            border: '1.5px solid #e0e7ff',
            borderRadius: 12,
            boxShadow: '0 2px 12px #8b5cf655',
            padding: '2rem 1.5rem',
            width: 360,
            minHeight: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '1.2rem',
          }}
        >
          <div style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: '0.7rem 1rem', textAlign: 'center', marginBottom: 8 }}>
            Welcome to Your DonorDrive Profile!
          </div>
          <div style={{ width: '100%', height: 1, background: '#e0e7ff', margin: '8px 0' }} />
          <div style={{ fontStyle: 'italic', color: '#8b5cf6', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            "The smallest act of kindness is worth more than the grandest intention."
            <div style={{ fontWeight: 600, color: '#64748b', fontSize: 15, marginTop: 4 }}>— Oscar Wilde</div>
          </div>
          <div style={{ width: '100%', height: 1, background: '#e0e7ff', margin: '8px 0' }} />
          <div style={{ width: '100%', background: '#f3f4f6', borderRadius: 8, padding: '1rem', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 4 }}>Current Profile</div>
            <div style={{ color: '#1e293b', fontWeight: 600 }}>{profile.name}</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>{profile.email}</div>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>{profile.bio}</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>{profile.contact}</div>
            <div style={{ color: profile.visibility === 'public' ? '#16a34a' : '#64748b', fontWeight: 600, fontSize: 14, marginTop: 4 }}>
              {profile.visibility === 'public' ? 'Public Profile' : 'Private Profile'}
            </div>
          </div>
          <div style={{ width: '100%', height: 1, background: '#e0e7ff', margin: '8px 0' }} />
          <div style={{ width: '100%', background: '#fff7ed', borderRadius: 8, padding: '0.8rem 1rem', color: '#ea580c', fontWeight: 600, fontSize: 15, textAlign: 'center', marginBottom: 8 }}>
            <span role="img" aria-label="activity">📝</span> Recent Activity: <span style={{ fontWeight: 400 }}>No recent activity yet.</span>
          </div>
          <div style={{ width: '100%', height: 1, background: '#e0e7ff', margin: '8px 0' }} />
          <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 20, textAlign: 'center', marginTop: 12 }}>
            DonorDrive
            <div style={{ color: '#3b82f6', fontWeight: 500, fontSize: 15, marginTop: 2 }}>
              Empowering Generosity, One Click at a Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 