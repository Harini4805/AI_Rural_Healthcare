import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import api from '../../services/api';

interface Village {
  id: number;
  name: string;
  code: string;
  district_id: number;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

interface District { id: number; name: string; }

export default function VillageList() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get<Village[]>('/villages?limit=500'),
      api.get<District[]>('/districts?limit=500'),
    ])
      .then(([v, d]) => { setVillages(v.data); setDistricts(d.data); })
      .catch(() => setError('Failed to load villages.'))
      .finally(() => setLoading(false));
  }, []);

  const districtName = (id: number) => districts.find((d) => d.id === id)?.name ?? `#${id}`;

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete village "${name}"?`)) return;
    try {
      await api.delete(`/villages/${id}`);
      setVillages((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setError('Failed to delete village.');
    }
  }

  return (
    <Layout
      title="Villages"
      actions={<Link to="/villages/new" className="btn btn-primary">＋ Add Village</Link>}
    >
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="spinner" />
      ) : villages.length === 0 ? (
        <div className="empty-state glass">
          <div className="icon">🏘️</div>
          <p>No villages registered yet.</p>
          <br />
          <Link to="/villages/new" className="btn btn-primary">Add Village</Link>
        </div>
      ) : (
        <div className="table-wrapper glass">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Code</th>
                <th>District</th>
                <th>Population</th>
                <th>Coordinates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((v) => (
                <tr key={v.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{v.id}</td>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td><span className="badge badge-default">{v.code}</span></td>
                  <td style={{ color: 'var(--cyan)' }}>{districtName(v.district_id)}</td>
                  <td>{v.population?.toLocaleString() ?? '—'}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {v.latitude != null && v.longitude != null
                      ? `${v.latitude.toFixed(4)}, ${v.longitude.toFixed(4)}`
                      : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/villages/${v.id}/edit`)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id, v.name)}>
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
