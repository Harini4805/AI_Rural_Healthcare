import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RankingResponse } from './RiskDashboard';

interface DistrictAnalyticsProps {
  ranking: RankingResponse;
}

export default function DistrictAnalytics({ ranking }: DistrictAnalyticsProps) {
  
  // Format data for charts
  const staffData = ranking.villages.map(v => ({
    name: v.village_name.length > 10 ? v.village_name.substring(0, 10) + '...' : v.village_name,
    Current: v.staff_count || 0,
    Required: v.staff_required || 0,
  }));

  const medData = ranking.villages.map(v => ({
    name: v.village_name.length > 10 ? v.village_name.substring(0, 10) + '...' : v.village_name,
    Stock: v.medicine_stock_pct || 0,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      
      {/* Header Card */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {ranking.district_name} Analytics
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          District-wide resource allocation overview
        </p>
      </div>

      {/* Charts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Staffing Chart */}
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '280px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', margin: 0 }}>
            Staffing: Current vs Required
          </h4>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ background: '#333', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem' }} 
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="Current" fill="var(--indigo)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Required" fill="var(--text-muted)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medicine Stock Chart */}
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '280px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', margin: 0 }}>
            Medicine Stock Availability (%)
          </h4>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={medData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ background: '#333', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Stock" 
                  stroke="var(--emerald)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorStock)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
