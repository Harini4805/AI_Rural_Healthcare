import { useEffect, useState } from 'react';
import Layout from '../Layout';
import api from '../../services/api';
import RiskMap from '../RiskAnalysis/RiskMap';
import RiskTable from '../RiskAnalysis/RiskTable';
import VillageDetail from '../RiskAnalysis/VillageDetail';
import type { RankingResponse } from '../RiskAnalysis/RiskDashboard';

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

  return (
    <Layout title={`District Officer View: ${ranking?.district_name || 'Loading...'}`}>
      {loading && <div className="spinner" />}
      
      {!loading && ranking && (
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
      )}
    </Layout>
  );
}
