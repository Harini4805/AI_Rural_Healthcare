import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../Layout';
import api from '../../services/api';

interface DistrictPayload {
  name: string;
  code: string;
  population: number | null;
  area_sq_km: number | null;
}

const empty: DistrictPayload = { name: '', code: '', population: null, area_sq_km: null };

export default function DistrictForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<DistrictPayload>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/districts/${id}`)
      .then(({ data }) => {
        setForm({ name: data.name, code: data.code, population: data.population, area_sq_km: data.area_sq_km });
      })
      .catch(() => setError('Failed to load district.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (k: keyof DistrictPayload, v: string | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/districts/${id}`, form);
        setSuccess('District updated successfully!');
      } else {
        await api.post('/districts', form);
        setSuccess('District created successfully!');
        setForm(empty);
      }
      setTimeout(() => navigate('/districts'), 800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Failed to save district.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={isEdit ? 'Edit District' : 'Add District'}
      actions={<Link to="/districts" className="btn btn-secondary">← Back</Link>}
    >
      {fetching ? (
        <div className="spinner" />
      ) : (
        <div className="form-card glass">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {isEdit ? `Editing district #${id}` : 'Fill in the details to create a new district'}
          </h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">District Name *</label>
                <input id="name" className="form-input" required
                  value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. North Rangpur" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="code">Code *</label>
                <input id="code" className="form-input" required
                  value={form.code} onChange={(e) => set('code', e.target.value)}
                  placeholder="e.g. NR-01" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="population">Population</label>
                <input id="population" type="number" className="form-input" min={0}
                  value={form.population ?? ''} onChange={(e) => set('population', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 250000" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="area">Area (km²)</label>
                <input id="area" type="number" className="form-input" min={0} step="0.01"
                  value={form.area_sq_km ?? ''} onChange={(e) => set('area_sq_km', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 1200.5" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Saving…' : isEdit ? '💾 Update District' : '➕ Create District'}
              </button>
              <Link to="/districts" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
