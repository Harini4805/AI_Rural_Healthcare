import { useState } from 'react';
import api from '../../services/api';
import { Settings2, Calculator, TrendingDown } from 'lucide-react';

interface AllocationPlannerProps {
  districtId: number;
}

export default function AllocationPlanner({ districtId }: AllocationPlannerProps) {
  const [specialists, setSpecialists] = useState(3);
  const [mmus, setMmus] = useState(2);
  const [budget, setBudget] = useState(50000);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [riskReduction, setRiskReduction] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runOptimizer = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ml/optimize-allocation', {
        district_id: districtId,
        specialists_available: specialists,
        mmu_routes_available: mmus,
        medicine_budget: budget
      });
      setAllocations(res.data.allocations.sort((a: any, b: any) => 
        (b.specialists + b.mmu_routes + b.medicine_funds) - (a.specialists + a.mmu_routes + a.medicine_funds)
      ));
      setRiskReduction(res.data.total_risk_reduction_score);
      setStatus(res.data.model_status);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings2 size={24} color="var(--indigo)" />
            Resource Allocation Optimizer
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Mathematically optimal resource distribution to maximize district risk reduction (Model E).
          </p>
        </div>
        {status && <span className="badge badge-default">Status: {status}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Specialists Available</label>
          <input type="number" className="form-input" value={specialists} onChange={e => setSpecialists(Number(e.target.value))} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>MMU Routes Available</label>
          <input type="number" className="form-input" value={mmus} onChange={e => setMmus(Number(e.target.value))} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Medicine Budget ($)</label>
          <input type="number" className="form-input" step="5000" value={budget} onChange={e => setBudget(Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={runOptimizer} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 16, height: 16 }}/> : <Calculator size={18} />}
            Run Optimizer
          </button>
        </div>
      </div>

      {allocations.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Optimal Allocation Plan</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)' }}>
              <TrendingDown size={20} />
              <span style={{ fontWeight: 600 }}>Projected Risk Reduction: {riskReduction} pts</span>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Village</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Specialists</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>MMUs</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Medicine Budget</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.village_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{a.village_name}</td>
                    <td style={{ padding: '0.75rem' }}>{a.specialists > 0 ? <span className="badge badge-error">{a.specialists}</span> : '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.mmu_routes > 0 ? <span className="badge badge-error">{a.mmu_routes}</span> : '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.medicine_funds > 0 ? `$${a.medicine_funds}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
