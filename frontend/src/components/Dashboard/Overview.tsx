import { useEffect, useState } from 'react';
import Layout from '../Layout';
import api from '../../services/api';

interface Stats {
  districts: number;
  villages: number;
  healthRecords: number;
  patterns: number;
  criticalCases: number;
  verifiedRecords: number;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    districts: 0,
    villages: 0,
    healthRecords: 0,
    patterns: 0,
    criticalCases: 0,
    verifiedRecords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, v, hr] = await Promise.all([
          api.get('/districts?limit=1000'),
          api.get('/villages?limit=1000'),
          api.get('/health-records?limit=1000'),
        ]);
        const districts = d.data as { id: number }[];
        const villages = v.data as { id: number }[];
        const records = hr.data as { severity_level: string; verified: boolean }[];

        let patternsCount = 0;
        try {
          const pRes = await api.get('/patterns?limit=1000');
          patternsCount = (pRes.data as { id: number }[]).length;
        } catch { /* patterns endpoint optional */ }

        setStats({
          districts: districts.length,
          villages: villages.length,
          healthRecords: records.length,
          patterns: patternsCount,
          criticalCases: records.filter((r) => r.severity_level === 'critical').length,
          verifiedRecords: records.filter((r) => r.verified).length,
        });
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { icon: '🏛️', label: 'Districts', value: stats.districts, sub: 'Administrative units', color: 'var(--indigo)' },
    { icon: '🏘️', label: 'Villages', value: stats.villages, sub: 'Registered clusters', color: 'var(--violet)' },
    { icon: '🩺', label: 'Health Records', value: stats.healthRecords, sub: 'Total cases logged', color: 'var(--cyan)' },
    { icon: '🔬', label: 'Patterns', value: stats.patterns, sub: 'Predictive models', color: 'var(--emerald)' },
    { icon: '🚨', label: 'Critical Cases', value: stats.criticalCases, sub: 'Require attention', color: 'var(--rose)' },
    { icon: '✅', label: 'Verified Records', value: stats.verifiedRecords, sub: 'Quality-assured', color: 'var(--amber)' },
  ];

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div
            className="glass"
            style={{
              padding: '1.5rem 2rem',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
              borderColor: 'rgba(99,102,241,0.3)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Welcome back 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              AI-powered health intelligence network for rural disease prevention. Here's today's overview.
            </p>
          </div>

          <div className="stats-grid">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="stat-card glass glass-hover"
                style={{ borderLeft: `3px solid ${s.color}` }}
              >
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-value" style={{ color: s.color }}>
                  {s.value.toLocaleString()}
                </div>
                <div className="stat-card-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div
            className="glass"
            style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            <p>📡 Use the sidebar to manage Districts, Villages, Health Records and Predictive Patterns.</p>
          </div>
        </>
      )}
    </Layout>
  );
}
