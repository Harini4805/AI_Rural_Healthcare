import { useEffect, useState } from 'react';
import Layout from '../Layout';
import api from '../../services/api';
import RiskMap from '../RiskAnalysis/RiskMap';
import RiskTable from '../RiskAnalysis/RiskTable';
import VillageDetail from '../RiskAnalysis/VillageDetail';
import type { RankingResponse } from '../RiskAnalysis/RiskDashboard';
import { RadialBarChart, RadialBar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, PackageSearch, ShieldAlert } from 'lucide-react';

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

  // Mock data for Resource Utilization Area Chart
  const resourceData = [
    { day: 'Mon', medicine: 80, staff: 90 },
    { day: 'Tue', medicine: 75, staff: 85 },
    { day: 'Wed', medicine: 65, staff: 85 },
    { day: 'Thu', medicine: 70, staff: 95 },
    { day: 'Fri', medicine: 60, staff: 80 },
    { day: 'Sat', medicine: 50, staff: 70 },
    { day: 'Sun', medicine: 45, staff: 65 },
  ];

  // Derive Risk Distribution for Radial Chart
  let criticalCount = 0, highCount = 0, medCount = 0, lowCount = 0;
  ranking?.villages.forEach(v => {
    if (v.composite_score > 75) criticalCount++;
    else if (v.composite_score > 50) highCount++;
    else if (v.composite_score > 25) medCount++;
    else lowCount++;
  });

  const radialData = [
    { name: 'Low Risk', value: lowCount, fill: '#10b981' },
    { name: 'Medium Risk', value: medCount, fill: '#3b82f6' },
    { name: 'High Risk', value: highCount, fill: '#f59e0b' },
    { name: 'Critical Risk', value: criticalCount, fill: '#f43f5e' },
  ];

  return (
    <Layout title={`District Officer View: ${ranking?.district_name || 'Loading...'}`}>
      {loading && <div className="spinner" style={{ margin: '4rem auto' }} />}
      
      {!loading && ranking && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <ShieldAlert size={24} color="var(--rose)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{criticalCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Outbreaks</div>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <PackageSearch size={24} color="var(--indigo)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>72%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resource Utilization</div>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <Users size={24} color="var(--emerald)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>18/24</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Field Workers Active</div>
              </div>
            </div>
          </div>

          {/* Attractive Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem', height: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Village Risk Distribution</h3>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={15} data={radialData}>
                    <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '1.5rem', height: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Resource Availability Trend</h3>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={resourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorStaff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--indigo)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--indigo)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="medicine" stroke="var(--cyan)" fillOpacity={1} fill="url(#colorMed)" name="Medicine %" />
                    <Area type="monotone" dataKey="staff" stroke="var(--indigo)" fillOpacity={1} fill="url(#colorStaff)" name="Staffing %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Left Column: Map & Table */}
            <div style={{ flex: '1 1 50%', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1rem', height: '400px' }}>
                 <RiskMap villages={ranking.villages} selectedId={selectedVillageId} onSelect={setSelectedVillageId} />
              </div>
              <div className="glass" style={{ padding: '1rem' }}>
                 <RiskTable villages={ranking.villages} selectedId={selectedVillageId} onSelect={setSelectedVillageId} />
              </div>
            </div>

            {/* Right Column: Detail Panel */}
            <div style={{ flex: '1 1 40%', minWidth: '350px' }}>
              {activeVillage ? (
                <VillageDetail village={activeVillage} onClose={() => setSelectedVillageId(null)} />
              ) : (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
