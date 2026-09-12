import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import api from '../../services/api';

interface HealthRecord {
  id: number;
  district_id: number;
  village_id: number;
  disease_type: string;
  case_count: number;
  severity_level: string | null;
  intervention_type: string | null;
  outcome_status: string | null;
  recorded_by: string;
  recorded_at: string;
  verified: boolean;
}

interface District { id: number; name: string; }
interface Village { id: number; name: string; }

function SeverityBadge({ level }: { level: string | null }) {
  if (!level) return <span className="badge badge-default">—</span>;
  const cls = `badge badge-${level}`;
  return <span className={cls}>{level}</span>;
}

export default function RecordList() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get<HealthRecord[]>('/health-records?limit=500'),
      api.get<District[]>('/districts?limit=500'),
      api.get<Village[]>('/villages?limit=500'),
    ])
      .then(([r, d, v]) => {
        setRecords(r.data);
        setDistricts(d.data);
        setVillages(v.data);
      })
      .catch(() => setError('Failed to load health records.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this health record?')) return;
    try {
      await api.delete(`/health-records/${id}`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Failed to delete record.');
    }
  }

  const districtName = (id: number) => districts.find((d) => d.id === id)?.name ?? `#${id}`;
  const villageName = (id: number) => villages.find((v) => v.id === id)?.name ?? `#${id}`;

  const filtered = filter
    ? records.filter(
        (r) =>
          r.disease_type.toLowerCase().includes(filter.toLowerCase()) ||
          r.recorded_by.toLowerCase().includes(filter.toLowerCase()),
      )
    : records;

  return (
    <Layout
      title="Health Records"
      actions={<Link to="/health-records/new" className="btn btn-primary">＋ Add Record</Link>}
    >
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ marginBottom: '1rem' }}>
        <input
          className="form-input"
          style={{ maxWidth: 320 }}
          placeholder="🔍 Filter by disease or worker…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state glass">
          <div className="icon">🩺</div>
          <p>{filter ? 'No matching records found.' : 'No health records yet.'}</p>
          {!filter && <><br /><Link to="/health-records/new" className="btn btn-primary">Add Record</Link></>}
        </div>
      ) : (
        <div className="table-wrapper glass">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Disease</th>
                <th>Cases</th>
                <th>Severity</th>
                <th>District</th>
                <th>Village</th>
                <th>Recorded By</th>
                <th>Verified</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{r.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--cyan)' }}>{r.disease_type}</td>
                  <td style={{ fontWeight: 700 }}>{r.case_count}</td>
                  <td><SeverityBadge level={r.severity_level} /></td>
                  <td>{districtName(r.district_id)}</td>
                  <td>{villageName(r.village_id)}</td>
                  <td style={{ fontSize: '0.82rem' }}>{r.recorded_by}</td>
                  <td>
                    {r.verified
                      ? <span style={{ color: 'var(--emerald)' }}>✅ Yes</span>
                      : <span style={{ color: 'var(--text-muted)' }}>⏳ No</span>}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(r.recorded_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/health-records/${r.id}/edit`)}>
                        ✏️
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
