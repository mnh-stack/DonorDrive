import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const categories = [
  'Health',
  'Education',
  'Emergency',
  'Community',
  'Environment',
  'Animals',
  'Other'
];

const CampaignEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal_amount: '',
    end_date: '',
    category: '',
    image: null as File | null,
    image_path: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    // Fetch campaign data
    fetch(`/api/campaigns/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          goal_amount: data.goal_amount || '',
          end_date: data.end_date ? data.end_date.slice(0, 10) : '',
          category: data.category || '',
          image: null,
          image_path: data.image_path || ''
        });
        if (data.image_path) {
          setImagePreview(`/uploads/campaign_images/${data.image_path}`);
          setOriginalImage(`/uploads/campaign_images/${data.image_path}`);
        }
      });
  }, [id]);

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
      setImagePreview(originalImage);
    }
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.goal_amount || isNaN(Number(form.goal_amount)) || Number(form.goal_amount) <= 0) return 'Goal amount must be a positive number.';
    if (!form.end_date) return 'End date is required.';
    if (!form.category) return 'Category is required.';
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
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('goal_amount', form.goal_amount);
    formData.append('end_date', form.end_date);
    formData.append('category', form.category);
    if (form.image) formData.append('image', form.image);
    try {
      const res = await fetch(`/api/campaigns/${id}/edit`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Campaign updated successfully!');
        setTimeout(() => history.push('/dashboard'), 1200);
      } else {
        setError(data.error || 'Failed to update campaign.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Preview mode: show a card with the updated info
  if (preview) {
    return (
      <div className="campaign-edit-preview" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px #8b5cf655', padding: '2.5rem 2.2rem', maxWidth: 480, width: '100%', position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.7s' }}>
          <button
            type="button"
            onClick={() => setPreview(false)}
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
            &larr; Back to Edit
          </button>
          <h2 style={{ color: '#8b5cf6', textAlign: 'center', fontWeight: 800, fontSize: 28, marginBottom: 18, letterSpacing: 1, background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Preview Campaign Changes</h2>
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginBottom: 18, borderRadius: 10, maxHeight: 200, objectFit: 'cover', boxShadow: '0 2px 8px #8b5cf655' }} />}
          <div style={{ marginBottom: 10 }}><b>Title:</b> {form.title}</div>
          <div style={{ marginBottom: 10 }}><b>Description:</b> {form.description}</div>
          <div style={{ marginBottom: 10 }}><b>Goal Amount:</b> {form.goal_amount}</div>
          <div style={{ marginBottom: 10 }}><b>End Date:</b> {form.end_date}</div>
          <div style={{ marginBottom: 10 }}><b>Category:</b> {form.category}</div>
        </div>
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="campaign-edit-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="campaign-edit-form" onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px #8b5cf655', padding: '2.5rem 2.2rem', maxWidth: 440, width: '100%', position: 'relative', overflow: 'hidden', animation: 'fadeInDown 0.7s' }}>
        <button
          type="button"
          onClick={() => history.push('/owner-dashboard')}
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
        <h2 style={{ color: '#8b5cf6', textAlign: 'center', marginBottom: 18, fontWeight: 800, fontSize: 30, letterSpacing: 1, background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Edit Campaign</h2>
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
          <input type="file" accept="image/*" onChange={handleImage} style={{ width: '100%' }} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: 10, borderRadius: 8, maxHeight: 180, objectFit: 'cover', boxShadow: '0 2px 8px #8b5cf655' }} />}
        </div>
        {error && <div className="form-error" style={{ color: '#dc2626', background: '#fee2e2', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600, textAlign: 'center' }}>{error}</div>}
        {success && <div className="form-success" style={{ color: '#059669', background: '#d1fae5', borderRadius: 8, padding: '0.7rem 1rem', margin: '12px 0', fontWeight: 600, textAlign: 'center' }}>{success}</div>}
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <button
            type="button"
            onClick={() => setPreview(true)}
            style={{
              width: '50%',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 17,
              padding: '0.9rem 0',
              background: '#f59e42',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #f59e4266',
              border: 'none',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
          >
            Preview Changes
          </button>
          <button
            type="submit"
            className="register-btn"
            disabled={loading}
            style={{
              width: '50%',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 17,
              padding: '0.9rem 0',
              background: loading ? '#a5b4fc' : '#8b5cf6',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 2px 8px #8b5cf655',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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

export default CampaignEdit; 