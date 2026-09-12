import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../Layout';
import api from '../../services/api';

interface District { id: number; name: string; }
interface Village  { id: number; name: string; district_id: number; }

interface RecordPayload {
  district_id: number | null;
  village_id: number | null;
  disease_type: string;
  case_count: number;
  severity_level: string;
  intervention_type: string;
  intervention_notes: string;
  recorded_by: string;
}

const empty: RecordPayload = {
  district_id: null,
  village_id: null,
  disease_type: '',
  case_count: 0,
  severity_level: '',
  intervention_type: '',
  intervention_notes: '',
  recorded_by: '',
};

export default function RecordForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<RecordPayload>(empty);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loads: Promise<unknown>[] = [
      api.get<District[]>('/districts?limit=500').then(({ data }) => setDistricts(data)),
      api.get<Village[]>('/villages?limit=500').then(({ data }) => setVillages(data)),
    ];
    if (isEdit) {
      loads.push(
        api.get(`/health-records/${id}`).then(({ data }) => {
          setForm({
            district_id: data.district_id,
            village_id: data.village_id,
            disease_type: data.disease_type,
            case_count: data.case_count,
            severity_level: data.severity_level ?? '',
            intervention_type: data.intervention_type ?? '',
            intervention_notes: data.intervention_notes ?? '',
            recorded_by: data.recorded_by,
          });
        }),
      );
    }
    Promise.all(loads)
      .catch(() => setError('Failed to load form data.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  // Filter villages by selected district
  useEffect(() => {
    if (form.district_id) {
      setFilteredVillages(villages.filter((v) => v.district_id === form.district_id));
    } else {
      setFilteredVillages(villages);
    }
  }, [form.district_id, villages]);

  const set = (k: keyof RecordPayload, v: string | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.district_id || !form.village_id) { setError('Select district and village.'); return; }
    setError(''); setSuccess('');
    setLoading(true);

    const payload = {
      ...form,
      severity_level: form.severity_level || null,
      intervention_type: form.intervention_type || null,
      intervention_notes: form.intervention_notes || null,
    };

    try {
      if (isEdit) {
        await api.put(`/health-records/${id}`, payload);
        setSuccess('Record updated!');
      } else {
        await api.post('/health-records', payload);
        setSuccess('Record created!');
        setForm(empty);
      }
      setTimeout(() => navigate('/health-records'), 800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Failed to save record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={isEdit ? 'Edit Health Record' : 'Add Health Record'}
      actions={<Link to="/health-records" className="btn btn-secondary">← Back</Link>}
    >
      {fetching ? (
        <div className="spinner" />
      ) : (
        <div className="form-card glass" style={{ maxWidth: 800 }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Location */}
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.08em' }}>
              📍 Location
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">District *</label>
                <select className="form-select" required
                  value={form.district_id ?? ''}
                  onChange={(e) => {
                    set('district_id', e.target.value ? Number(e.target.value) : null);
                    set('village_id', null);
                  }}>
                  <option value="">— Select District —</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Village *</label>
                <select className="form-select" required
                  value={form.village_id ?? ''}
                  onChange={(e) => set('village_id', e.target.value ? Number(e.target.value) : null)}>
                  <option value="">— Select Village —</option>
                  {filteredVillages.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>

            {/* Disease */}
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '1rem 0', letterSpacing: '0.08em' }}>
              🦠 Disease Information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Disease Type *</label>
                <input className="form-input" required
                  value={form.disease_type} onChange={(e) => set('disease_type', e.target.value)}
                  placeholder="e.g. Malaria, Dengue, Cholera" />
              </div>
              <div className="form-group">
                <label className="form-label">Case Count</label>
                <input type="number" className="form-input" min={0}
                  value={form.case_count}
                  onChange={(e) => set('case_count', Number(e.target.value))} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <select className="form-select"
                  value={form.severity_level}
                  onChange={(e) => set('severity_level', e.target.value)}>
                  <option value="">— None —</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Recorded By *</label>
                <input className="form-input" required
                  value={form.recorded_by} onChange={(e) => set('recorded_by', e.target.value)}
                  placeholder="Field worker name" />
              </div>
            </div>

            {/* Intervention */}
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '1rem 0', letterSpacing: '0.08em' }}>
              💊 Intervention
            </h3>
            <div className="form-group">
              <label className="form-label">Intervention Type</label>
              <input className="form-input"
                value={form.intervention_type} onChange={(e) => set('intervention_type', e.target.value)}
                placeholder="e.g. Vaccination, Medication, Quarantine" />
            </div>
            <div className="form-group">
              <label className="form-label">Intervention Notes</label>
              <textarea className="form-textarea"
                value={form.intervention_notes}
                onChange={(e) => set('intervention_notes', e.target.value)}
                placeholder="Additional notes about the intervention…" />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Saving…' : isEdit ? '💾 Update Record' : '➕ Create Record'}
              </button>
              <Link to="/health-records" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
