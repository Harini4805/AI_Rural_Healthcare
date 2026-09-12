import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { VillageRisk } from './RiskDashboard';

interface SimulatorProps {
  village: VillageRisk;
}

export default function Simulator({ village }: SimulatorProps) {
  const [addStaff, setAddStaff] = useState(0);
  const [addMedicine, setAddMedicine] = useState(0);
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset when village changes
    setAddStaff(0);
    setAddMedicine(0);
    setSimResult(null);
  }, [village.village_id]);

  useEffect(() => {
    if (addStaff === 0 && addMedicine === 0) {
      setSimResult(null);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.post(`/villages/${village.village_id}/simulate`, {
        add_staff: addStaff,
        add_medicine_stock_pct: addMedicine
      })
      .then(res => setSimResult(res.data))
      .catch(err => console.error("Sim error", err))
      .finally(() => setLoading(false));
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [addStaff, addMedicine, village.village_id]);

  const currentScore = village.composite_score;
  const newScore = simResult ? simResult.after.composite_score : currentScore;
  const diff = currentScore - newScore;

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🧪 What-If Simulator
      </h4>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Adjust resources below to simulate their impact on the village's risk score. (No data is saved).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Deploy Additional Staff</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>+{addStaff}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={village.staff_required ? village.staff_required - (village.staff_count || 0) : 10} 
            value={addStaff} 
            onChange={(e) => setAddStaff(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Restock Medicine (%)</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>+{addMedicine}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={100 - (village.medicine_stock_pct || 0)} 
            value={addMedicine} 
            onChange={(e) => setAddMedicine(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Projected Score</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: diff > 0 ? 'var(--emerald)' : 'var(--text-primary)' }}>
            {loading ? '...' : newScore}
          </div>
        </div>
        {diff > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 600 }}>Improvement</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald)' }}>-{diff.toFixed(1)} pts</div>
          </div>
        )}
      </div>
    </div>
  );
}
