import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const categories = [
  'Health',
  'Education',
  'Emergency',
  'Community',
  'Environment',
  'Animals',
  'Other'
];

const CampaignCreate: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal_amount: '',
    end_date: '',
    category: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
    setError('');
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.goal_amount || isNaN(Number(form.goal_amount)) || Number(form.goal_amount) <= 0) return 'Goal amount must be a positive number.';
    if (!form.end_date) return 'End date is required.';
    if (!form.category) return 'Category is required.';
    if (!form.image) return 'Image is required.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('user_id') || '');
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('goal_amount', form.goal_amount);
    formData.append('end_date', form.end_date);
    formData.append('category', form.category);
    if (form.image) formData.append('image', form.image);
    try {
      const res = await fetch('/api/campaigns/create', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Campaign created successfully!');
        setForm({ title: '', description: '', goal_amount: '', end_date: '', category: '', image: null });
        setImagePreview(null);
      } else {
        setError(data.error || 'Failed to create campaign.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-create-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="campaign-create-form" onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px #8b5cf655', padding: '2.5rem 2.2rem', maxWidth: 440, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => history.push('/dashboard')}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.2rem',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #8b5cf655',
            transition: 'background 0.2s, box-shadow 0.2s',
            zIndex: 2
          }}
        >
          &larr; Back to Dashboard
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18, marginTop: 8 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 60%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px #8b5cf655',
            marginBottom: 8,
            animation: 'popIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
          }}>
            <span role="img" aria-label="DonorDrive Logo" style={{ fontSize: 36, color: '#fff', filter: 'drop-shadow(0 2px 8px #3b82f655)' }}>💙</span>
          </div>
          <h2 style={{
            color: '#8b5cf6',
            textAlign: 'center',
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 1,
            margin: 0,
            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fadeInDown 0.8s cubic-bezier(.68,-0.55,.27,1.55)'
          }}>
            DonorDrive Campaign Creation
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: 16,
            textAlign: 'center',
            margin: '10px 0 0 0',
            fontWeight: 500,
            lineHeight: 1.5,
            animation: 'fadeInUp 1.1s cubic-bezier(.68,-0.55,.27,1.55)'
          }}>
            <b>DonorDrive</b> empowers you to launch impactful fundraising campaigns with ease.<br />
            <span style={{ color: '#8b5cf6', fontWeight: 700 }}>Create a campaign</span> to share your story, inspire donors, and make a real difference.<br />
            Upload a compelling image, set your goal, and watch your community rally around your cause.<br />
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>DonorDrive</span> is your trusted partner for transparent, effective, and inspiring fundraising.
          </p>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: '100%', resize: 'vertical' }} />
        </div>
        <div className="form-group">
          <label>Goal Amount</label>
          <input type="number" name="goal_amount" value={form.goal_amount} onChange={handleChange} min={1} required style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required style={{ width: '100%' }}>
            <option value="">Select a category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Campaign Image</label>
          <input type="file" accept="image/*" onChange={handleImage} required style={{ width: '100%' }} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: 10, borderRadius: 8, maxHeight: 180, objectFit: 'cover' }} />}
        </div>
        {error && <div className="form-error" style={{ color: '#dc2626', background: '#fee2e2', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600, textAlign: 'center' }}>{error}</div>}
        {success && <div className="form-success" style={{ color: '#059669', background: '#d1fae5', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600, textAlign: 'center' }}>{success}</div>}
        <button type="submit" className="register-btn" disabled={loading} style={{ width: '100%', borderRadius: 8, fontWeight: 700, fontSize: 17, padding: '0.9rem 0', marginTop: 10, background: loading ? '#a5b4fc' : '#8b5cf6', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 2px 8px #8b5cf655', transition: 'background 0.2s, box-shadow 0.2s' }}>{loading ? 'Creating...' : 'Create Campaign'}</button>
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
      </form>
    </div>
  );
};

export default CampaignCreate; 