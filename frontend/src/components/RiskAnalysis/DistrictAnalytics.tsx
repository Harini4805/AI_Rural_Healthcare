import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RankingResponse } from './RiskDashboard';

interface DistrictAnalyticsProps {
  ranking: RankingResponse;
}

export default function DistrictAnalytics({ ranking }: DistrictAnalyticsProps) {
  
  // Format data for charts
  const staffData = ranking.villages.map(v => ({
    name: v.village_name,
    Current: v.staff_count || 0,
    Required: v.staff_required || 0,
  }));

  const medData = ranking.villages.map(v => ({
    name: v.village_name,
    Stock: v.medicine_stock_pct || 0,
  }));

  return (
    <div className="glass" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {ranking.district_name} Analytics
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          District-wide resource allocation overview
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Staffing Chart */}
        <div style={{ flex: 1, minHeight: '220px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Staffing: Current vs Required
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="Current" fill="var(--indigo)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Required" fill="var(--border)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Medicine Stock Chart */}
        <div style={{ flex: 1, minHeight: '220px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Medicine Stock Availability (%)
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={medData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="Stock" fill="var(--emerald)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
