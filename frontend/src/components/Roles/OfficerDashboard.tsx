import { useEffect, useState } from 'react';
import Layout from '../Layout';
import api from '../../services/api';
import RiskMap from '../RiskAnalysis/RiskMap';
import RiskTable from '../RiskAnalysis/RiskTable';
import VillageDetail from '../RiskAnalysis/VillageDetail';
import type { RankingResponse } from '../RiskAnalysis/RiskDashboard';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Home, ShieldAlert, Users, Activity } from 'lucide-react';

export default function OfficerDashboard() {
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVillageId, setSelectedVillageId] = useState<number | null>(null);
  const districtId = 1; // Hardcoded to ID 1 for Officer persona MVP

  useEffect(() => {
    setLoading(true);
    api
      .get<RankingResponse>(`/districts/${districtId}/ranking`)
      .then((res) => setRanking(res.data))
      .catch((err) => console.error('Failed to load ranking', err))
      .finally(() => setLoading(false));
  }, []);

  const activeVillage = ranking?.villages.find((v) => v.village_id === selectedVillageId);

  // Derive metrics
  const totalVillages = ranking?.villages.length || 0;
  let criticalCount = 0, highCount = 0, medCount = 0, lowCount = 0;
  let totalScore = 0;
  
  ranking?.villages.forEach(v => {
    totalScore += v.composite_score;
    if (v.composite_score > 75) criticalCount++;
    else if (v.composite_score > 50) highCount++;
    else if (v.composite_score > 25) medCount++;
    else lowCount++;
  });
  
  const avgScore = totalVillages ? Math.round(totalScore / totalVillages) : 0;

  // Bar Chart Data (Top 8 villages by score)
  const barData = ranking?.villages.slice(0, 8).map(v => ({
    name: v.village_name.length > 10 ? v.village_name.substring(0, 10) + '...' : v.village_name,
    score: Math.round(v.composite_score)
  })) || [];

  // Donut Chart Data
  const donutData = [
    { name: 'Critical Risk', value: criticalCount, fill: '#f43f5e' },
    { name: 'High Risk', value: highCount, fill: '#f59e0b' },
    { name: 'Medium Risk', value: medCount, fill: '#3b82f6' },
    { name: 'Low Risk', value: lowCount, fill: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <Layout title={`District Officer View: ${ranking?.district_name || 'Loading...'}`}>
      {loading && <div className="spinner" style={{ margin: '4rem auto' }} />}
      
      {!loading && ranking && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top KPI Row (4 Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Card 1 */}
            <div className="glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '12px' }}>
              <div style={{ background: '#d1fae5', color: '#059669', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>TOTAL VILLAGES</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{totalVillages}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>monitored locations</div>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '12px' }}>
              <div style={{ background: '#dbeafe', color: '#2563eb', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>CRITICAL RISKS</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{criticalCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>require attention</div>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '12px' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>ACTIVE WORKERS</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>18</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>deployed in field</div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '12px' }}>
              <div style={{ background: '#ffe4e6', color: '#e11d48', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>AVG RISK SCORE</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{avgScore}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>out of 100</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left Chart: Bar Chart */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Risk Score by Village</h3>
                <select className="form-select" style={{ width: 'auto', padding: '0.35rem 2rem 0.35rem 0.75rem', fontSize: '0.85rem' }}>
                  <option>Top 8 Highest</option>
                  <option>All Villages</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} 
                      axisLine={false} 
                      tickLine={false} 
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} 
                      axisLine={false} 
                      tickLine={false} 
                      domain={[0, 100]}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#333', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }} 
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Right Chart: Donut Chart with Legend */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Risk Distribution Overview</h3>
                <select className="form-select" style={{ width: 'auto', padding: '0.35rem 2rem 0.35rem 0.75rem', fontSize: '0.85rem' }}>
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={donutData} 
                      cx="40%" 
                      cy="50%" 
                      innerRadius="50%" 
                      outerRadius="80%" 
                      paddingAngle={2}
                      dataKey="value" 
                      stroke="none"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }} itemStyle={{ color: '#fff' }} />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                      iconType="square"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lower section: Map and Table */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div style={{ flex: '1 1 50%', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1rem', height: '400px', borderRadius: '12px' }}>
                 <RiskMap villages={ranking.villages} selectedId={selectedVillageId} onSelect={setSelectedVillageId} />
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                 <RiskTable villages={ranking.villages} selectedId={selectedVillageId} onSelect={setSelectedVillageId} />
              </div>
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '350px' }}>
              {activeVillage ? (
                <VillageDetail village={activeVillage} onClose={() => setSelectedVillageId(null)} />
              ) : (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '12px' }}>
                  <h3>Select a village</h3>
                  <p>Click on a village in the map or table to view detailed risk analysis and run what-if simulations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
