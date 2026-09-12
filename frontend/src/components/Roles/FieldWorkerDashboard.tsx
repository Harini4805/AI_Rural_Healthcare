import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, MapPin, Plus, ShieldAlert } from 'lucide-react';
import Layout from '../Layout';
import api from '../../services/api';
import type { RankingResponse, VillageRisk } from '../RiskAnalysis/RiskDashboard';

export default function FieldWorkerDashboard() {
  const [tasks, setTasks] = useState<VillageRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  
  const districtId = 1; // MVP Hardcode

  useEffect(() => {
    setLoading(true);
    api
      .get<RankingResponse>(`/districts/${districtId}/ranking`)
      .then((res) => {
        if (res.data.villages) {
          // Take top 3 highest risk villages as assigned tasks
          setTasks(res.data.villages.slice(0, 3));
        }
      })
      .catch((err) => console.error('Failed to load ranking', err))
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = (id: number) => {
    setResolvingId(id);
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.village_id !== id));
      setResolvingId(null);
    }, 800);
  };

  const getChecklist = (driver: string) => {
    if (driver.includes('medicine')) {
      return [
        'Audit current stock levels',
        'Request emergency supply drop',
        'Log affected patients'
      ];
    }
    if (driver.includes('disease')) {
      return [
        'Conduct door-to-door screening',
        'Distribute preventive kits',
        'Identify outbreak epicenter'
      ];
    }
    return [
      'Assess local clinic status',
      'Report infrastructure gaps',
      'Verify staffing schedules'
    ];
  };

  return (
    <Layout title="Field Tasks">
      {loading && <div className="spinner" style={{ margin: '4rem auto' }} />}
      
      {!loading && (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>Active Queue</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                You have {tasks.length} priority assignments today
              </p>
            </div>
            {tasks.length > 0 && (
              <span className="badge badge-error" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
                <ShieldAlert size={14} style={{ marginRight: '0.25rem' }} />
                Action Required
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {tasks.map((task) => {
                const isExpanded = expandedId === task.village_id;
                const isResolving = resolvingId === task.village_id;
                const checklist = getChecklist(task.dominant_driver);
                
                return (
                  <motion.div
                    key={task.village_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 100 }}
                    transition={{ duration: 0.3 }}
                    className="glass"
                    style={{ 
                      overflow: 'hidden',
                      borderLeft: `4px solid ${task.composite_score > 75 ? 'var(--rose)' : 'var(--amber)'}`,
                      opacity: isResolving ? 0.5 : 1
                    }}
                  >
                    {/* Header / Condensed View */}
                    <div 
                      onClick={() => !isResolving && setExpandedId(isExpanded ? null : task.village_id)}
                      style={{ 
                        padding: '1.25rem', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        cursor: isResolving ? 'default' : 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{task.village_name}</h3>
                          {task.composite_score > 75 && (
                            <AlertTriangle size={14} color="var(--rose)" />
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          <MapPin size={12} />
                          <span>{task.dominant_driver.replace(/_/g, ' ').toUpperCase()}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: task.composite_score > 75 ? 'var(--rose)' : 'var(--amber)' }}>
                            {Math.round(task.composite_score)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded View */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <div style={{ padding: '1.25rem' }}>
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '2px solid var(--emerald)' }}>
                              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: 'var(--emerald)' }}>Recommended Action</h4>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{task.recommendation}</p>
                            </div>

                            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Intervention Checklist</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                              {checklist.map((item, idx) => (
                                <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                                  <input type="checkbox" style={{ marginTop: '0.25rem', accentColor: 'var(--cyan)', width: '1.1rem', height: '1.1rem' }} />
                                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item}</span>
                                </label>
                              ))}
                            </div>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleResolve(task.village_id); }}
                              disabled={isResolving}
                              className="btn btn-primary"
                              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                            >
                              {isResolving ? (
                                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                              ) : (
                                <>
                                  <CheckCircle2 size={18} style={{ marginRight: '0.5rem' }} />
                                  Mark as Resolved
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {tasks.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="var(--emerald)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>You have no priority tasks in your queue.</p>
              </motion.div>
            )}
          </div>

          {/* Floating Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '56px',
              height: '56px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, var(--cyan), var(--indigo))',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              zIndex: 100
            }}
          >
            <Plus size={28} />
          </motion.button>

        </div>
      )}
    </Layout>
  );
}
