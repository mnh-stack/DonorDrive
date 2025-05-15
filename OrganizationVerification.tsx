import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaFileAlt } from 'react-icons/fa';

const OrganizationVerification: React.FC = () => {
  const [profile, setProfile] = useState<any>({});
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationBadge, setVerificationBadge] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    fetch(`/api/profile?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        if (data.user_type === 'organization' && data.id) {
          fetch(`/api/org-verification/status?user_id=${data.id}`)
            .then(res => res.json())
            .then(ver => {
              setVerificationStatus(ver.verification_status);
              setVerificationBadge(ver.verification_status === 'verified');
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVerificationFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationError('');
    setVerificationSuccess('');
    if (e.target.files && e.target.files[0]) {
      setVerificationFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setVerificationError('');
    setVerificationSuccess('');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVerificationFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleVerificationUpload = async () => {
    setVerificationError('');
    setVerificationSuccess('');
    if (!verificationFile) {
      setVerificationError('Please select or drop a document to upload.');
      return;
    }
    if (profile.user_type !== 'organization') {
      setVerificationError('Only organization users can upload verification documents.');
      return;
    }
    if (!profile.id || isNaN(Number(profile.id))) {
      setVerificationError('Invalid user ID. Please re-login.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('document', verificationFile);
    formData.append('user_id', profile.id);
    try {
      const res = await fetch('/api/org-verification/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationSuccess('Document uploaded. Verification pending.');
        setVerificationFile(null);
        // Refetch status after upload
        fetch(`/api/org-verification/status?user_id=${profile.id}`)
          .then(res => res.json())
          .then(ver => {
            setVerificationStatus(ver.verification_status);
            setVerificationBadge(ver.verification_status === 'verified');
          });
      } else {
        setVerificationError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setVerificationError('Server error. Please try again later.');
    } finally {
      setUploading(false);
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

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }
  if (profile.user_type !== 'organization') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Organization Verification</h2>
        <p>This page is only for organization users.</p>
        <Link to="/profile">Back to Profile</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ede9fe 60%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px #8b5cf655', padding: '2.8rem 2.5rem', maxWidth: 480, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ color: '#3b82f6', textAlign: 'center', marginBottom: 18, fontWeight: 800, fontSize: 32, letterSpacing: 1 }}>Organization Verification</h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: dragActive ? '2.5px dashed #8b5cf6' : '2.5px dashed #c7d2fe',
            background: dragActive ? '#f3f4f6' : '#f8fafc',
            borderRadius: 16,
            padding: '1.5rem 1rem',
            textAlign: 'center',
            marginBottom: 18,
            transition: 'border 0.2s, background 0.2s',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="application/pdf,image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleVerificationFile}
          />
          {FaCloudUploadAlt({ size: 48, color: dragActive ? '#8b5cf6' : '#a5b4fc', style: { marginBottom: 8 } })}
          <div style={{ fontWeight: 700, color: '#3b82f6', fontSize: 18, marginBottom: 4 }}>
            {verificationFile ? (
              <span>{FaFileAlt({ style: { marginRight: 6, color: '#8b5cf6' } })}{verificationFile.name}</span>
            ) : (
              'Drag & drop or click to select a document'
            )}
          </div>
          <div style={{ color: '#64748b', fontSize: 14 }}>
            Accepted: PDF, PNG, JPG, JPEG, GIF
          </div>
        </div>
        <button
          type="button"
          onClick={handleVerificationUpload}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '0.9rem 0',
            borderRadius: 8,
            background: uploading ? '#a5b4fc' : '#8b5cf6',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 18,
            boxShadow: uploading ? 'none' : '0 2px 8px #8b5cf655',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {uploading ? FaSpinner({ className: 'spin', style: { fontSize: 22 } }) : FaCloudUploadAlt({ style: { fontSize: 22 } })}
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
        <div style={{ marginBottom: 14, textAlign: 'center', fontSize: 18, fontWeight: 600 }}>
          Status: <span style={{ color: verificationStatusColor }}>{verificationStatusText}</span>
          {verificationStatus === 'pending' && (
            <span style={{ marginLeft: 8, color: '#f59e42' }}>{FaSpinner({ className: 'spin', style: { fontSize: 18 } })} Under Review</span>
          )}
          {verificationStatus === 'verified' && (
            <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 700 }}>{FaCheckCircle({ style: { fontSize: 18 } })} Verified</span>
          )}
          {verificationStatus === 'rejected' && (
            <span style={{ marginLeft: 8, color: '#dc2626' }}>{FaTimesCircle({ style: { fontSize: 18 } })} Rejected</span>
          )}
        </div>
        {verificationBadge && (
          <div style={{ color: '#16a34a', fontWeight: 700, marginTop: 6, textAlign: 'center', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {FaCheckCircle({ style: { fontSize: 22 } })} Verified Organization Badge
          </div>
        )}
        {verificationError && <div className="form-error" style={{ textAlign: 'center', background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600 }}>{verificationError}</div>}
        {verificationSuccess && <div className="form-success" style={{ textAlign: 'center', background: '#d1fae5', color: '#059669', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600 }}>{verificationSuccess}</div>}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => history.push('/profile')}
            style={{
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.4rem',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #8b5cf655',
              transition: 'background 0.2s, box-shadow 0.2s',
              marginTop: 8
            }}
          >
            &larr; Back to Profile
          </button>
        </div>
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default OrganizationVerification; 