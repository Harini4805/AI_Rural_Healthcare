import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../../services/api';
import Simulator from './Simulator';
import type { VillageRisk } from './RiskDashboard';

interface VillageDetailProps {
  village: VillageRisk;
  onClose: () => void;
}

const COLORS = ['#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6'];

export default function VillageDetail({ village, onClose }: VillageDetailProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent health records for the trend line
    api.get(`/health-records?limit=20`)
      .then(res => {
        const records = (res.data as any[]).filter(r => r.village_id === village.village_id);
        // Group by day for a simple trend chart, or just use raw records
        // For simplicity, we just sort them and plot case_count
        const sorted = records.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
        setHistory(sorted.map(r => ({
          date: new Date(r.recorded_at).toLocaleDateString(),
          cases: r.case_count
        })));
      })
      .catch(err => console.error("History fetch error", err));
  }, [village.village_id]);

  const pieData = [
    { name: 'Disease Load', value: village.factors.disease_load },
    { name: 'Staff Vacancy', value: village.factors.staff_vacancy },
    { name: 'Medicine Gap', value: village.factors.medicine_gap },
    { name: 'Trend Factor', value: village.factors.trend },
  ];

  return (
    <div className="glass" style={{ padding: '1.5rem', position: 'relative' }}>
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
      >
        ✕
      </button>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Village Details</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{village.village_name}</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <span className="badge badge-default">Pop: {village.population.toLocaleString()}</span>
          <span className="badge badge-default">Score: {village.composite_score}</span>
        </div>
      </div>

      <div className="alert alert-info" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.25rem' }}>💡</span>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--indigo)' }}>Recommended Intervention</strong>
          <span style={{ fontSize: '0.85rem' }}>{village.recommendation}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
        {/* Risk Breakdown Chart */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Risk Factors Breakdown</h4>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => val.toFixed(1)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
            {pieData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                <span style={{ color: 'var(--text-muted)' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History Trend Chart */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Recent Case Trend</h4>
          <div style={{ height: '200px' }}>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="cases" stroke="var(--indigo)" strokeWidth={3} dot={{ r: 3, fill: 'var(--indigo)' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No recent case data available.
              </div>
            )}
          </div>
        </div>
      </div>

      <Simulator village={village} />
    </div>
  );
}
