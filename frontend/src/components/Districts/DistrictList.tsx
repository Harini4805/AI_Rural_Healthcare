import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import api from '../../services/api';

interface District {
  id: number;
  name: string;
  code: string;
  population: number | null;
  area_sq_km: number | null;
  created_at: string;
}

export default function DistrictList() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchDistricts(); }, []);

  async function fetchDistricts() {
    try {
      setLoading(true);
      const { data } = await api.get<District[]>('/districts?limit=200');
      setDistricts(data);
    } catch {
      setError('Failed to load districts.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete district "${name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/districts/${id}`);
      setDistricts((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError('Failed to delete district.');
    }
  }

  return (
    <Layout
      title="Districts"
      actions={
        <Link to="/districts/new" className="btn btn-primary">
          ＋ Add District
        </Link>
      }
    >
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="spinner" />
      ) : districts.length === 0 ? (
        <div className="empty-state glass">
          <div className="icon">🏛️</div>
          <p>No districts yet. Add your first district to get started.</p>
          <br />
          <Link to="/districts/new" className="btn btn-primary">Add District</Link>
        </div>
      ) : (
        <div className="table-wrapper glass">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Code</th>
                <th>Population</th>
                <th>Area (km²)</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{d.id}</td>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td><span className="badge badge-default">{d.code}</span></td>
                  <td>{d.population?.toLocaleString() ?? '—'}</td>
                  <td>{d.area_sq_km?.toLocaleString() ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/districts/${d.id}/edit`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(d.id, d.name)}
                      >
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
