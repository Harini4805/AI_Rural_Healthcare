import { useEffect, useState } from 'react';
import { Flame, Pill, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';

export default function FieldRequestsFeed() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incRes, medRes] = await Promise.all([
        api.get('/incident-reports?status=open'),
        api.get('/medicine-requests?status=pending')
      ]);
      // Sort by severity (critical > high > medium > low) then recency
      const sevOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      const sortedInc = incRes.data.sort((a: any, b: any) => {
        if (sevOrder[a.severity] !== sevOrder[b.severity]) {
          return sevOrder[b.severity] - sevOrder[a.severity];
        }
        return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime();
      });
      setIncidents(sortedInc);
      
      const sortedMed = medRes.data.sort((a: any, b: any) => {
        if (sevOrder[a.urgency] !== sevOrder[b.urgency]) {
          return sevOrder[b.urgency] - sevOrder[a.urgency];
        }
        return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime();
      });
      setMedicines(sortedMed);
    } catch (err) {
      console.error("Failed to load field feeds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleIncidentAction = async (id: number, status: string) => {
    try {
      await api.put(`/incident-reports/${id}`, { status });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMedicineAction = async (id: number, status: string) => {
    try {
      await api.put(`/medicine-requests/${id}`, { status });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '2rem auto' }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Incident Feed */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame color="var(--rose)" size={20} /> Field Incident Feed
          {incidents.length > 0 && <span className="badge badge-error" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{incidents.length} Open</span>}
        </h3>
        
        {incidents.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No open incidents reported from the field.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {incidents.map(inc => (
              <div key={inc.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid ${inc.severity === 'critical' || inc.severity === 'high' ? 'var(--rose)' : 'var(--amber)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{inc.village_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{inc.incident_type.replace('_', ' ')} • {inc.severity}</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(inc.reported_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{inc.description}"</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleIncidentAction(inc.id, 'acknowledged')} className="btn" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: 'none' }}>Acknowledge</button>
                  <button onClick={() => handleIncidentAction(inc.id, 'resolved')} className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'var(--emerald)', border: 'none', display: 'flex', justifyContent: 'center', gap: '0.25rem' }}><CheckCircle2 size={14} /> Resolve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medicine Requests */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pill color="var(--emerald)" size={20} /> Pending Medicine Requests
          {medicines.length > 0 && <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{medicines.length} Pending</span>}
        </h3>

        {medicines.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending medicine requests.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {medicines.map(med => (
              <div key={med.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid var(--emerald)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{med.medicine_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>x{med.quantity_needed}</span></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{med.village_name} • Urgency: {med.urgency}</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(med.requested_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                {med.notes && <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Note: {med.notes}</p>}
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: med.notes ? '0' : '1rem' }}>
                  <button onClick={() => handleMedicineAction(med.id, 'rejected')} className="btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--rose)', border: 'none' }}><XCircle size={14} /></button>
                  <button onClick={() => handleMedicineAction(med.id, 'approved')} className="btn" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: 'none' }}>Approve</button>
                  <button onClick={() => handleMedicineAction(med.id, 'fulfilled')} className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'var(--emerald)', border: 'none' }}>Fulfill</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
