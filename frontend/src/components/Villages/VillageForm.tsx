import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../Layout';
import api from '../../services/api';

interface District { id: number; name: string; }

interface VillagePayload {
  name: string;
  code: string;
  district_id: number | null;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
}

const empty: VillagePayload = {
  name: '', code: '', district_id: null,
  population: null, latitude: null, longitude: null,
};

export default function VillageForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<VillagePayload>(empty);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loads: Promise<unknown>[] = [
      api.get<District[]>('/districts?limit=500').then(({ data }) => setDistricts(data)),
    ];
    if (isEdit) {
      loads.push(
        api.get(`/villages/${id}`).then(({ data }) => {
          setForm({
            name: data.name,
            code: data.code,
            district_id: data.district_id,
            population: data.population,
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }),
      );
    }
    Promise.all(loads)
      .catch(() => setError('Failed to load data.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (k: keyof VillagePayload, v: string | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.district_id) { setError('Please select a district.'); return; }
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/villages/${id}`, form);
        setSuccess('Village updated!');
      } else {
        await api.post('/villages', form);
        setSuccess('Village created!');
        setForm(empty);
      }
      setTimeout(() => navigate('/villages'), 800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Failed to save village.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={isEdit ? 'Edit Village' : 'Add Village'}
      actions={<Link to="/villages" className="btn btn-secondary">← Back</Link>}
    >
      {fetching ? (
        <div className="spinner" />
      ) : (
        <div className="form-card glass">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="vname">Village Name *</label>
                <input id="vname" className="form-input" required
                  value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Tangail North" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vcode">Code *</label>
                <input id="vcode" className="form-input" required
                  value={form.code} onChange={(e) => set('code', e.target.value)}
                  placeholder="e.g. TN-001" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="district">District *</label>
              <select id="district" className="form-select"
                value={form.district_id ?? ''}
                onChange={(e) => set('district_id', e.target.value ? Number(e.target.value) : null)}
                required
              >
                <option value="">— Select District —</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="vpop">Population</label>
                <input id="vpop" type="number" className="form-input" min={0}
                  value={form.population ?? ''}
                  onChange={(e) => set('population', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 5000" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="lat">Latitude</label>
                <input id="lat" type="number" className="form-input" step="any"
                  value={form.latitude ?? ''}
                  onChange={(e) => set('latitude', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 24.3636" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lon">Longitude</label>
                <input id="lon" type="number" className="form-input" step="any"
                  value={form.longitude ?? ''}
                  onChange={(e) => set('longitude', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 89.9020" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Saving…' : isEdit ? '💾 Update Village' : '➕ Create Village'}
              </button>
              <Link to="/villages" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
