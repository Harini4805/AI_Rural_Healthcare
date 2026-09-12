import { Link } from 'react-router-dom';
import { ShieldAlert, TrendingUp, BellRing, GitBranch, Settings, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      {/* 1. NAVBAR */}
      <nav style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'rgba(15, 23, 42, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌿</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Health Intel Network
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-links">
            {/* Hide on very small screens, let CSS handle it ideally, but inline style here for simplicity: only show Login on mobile */}
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} className="hide-on-mobile">Features</a>
            <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} className="hide-on-mobile">How It Works</a>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none' }}>
              Login
            </Link>
          </div>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-on-mobile { display: block; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .hero-grid { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .hero-buttons { justify-content: center; }
          .roles-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* 2. HERO */}
      <section style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="hero-grid">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-1px', margin: 0 }}>
              Predict rural health risks <span style={{ color: 'var(--emerald)' }}>before</span> they become crises.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Fuses village infrastructure, staffing, medicine, and case-history data into an explainable risk score and an optimized resource plan.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
                View Dashboard
              </Link>
              <button onClick={scrollToFeatures} className="btn" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                See How It Works
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass" 
            style={{ 
              height: '400px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(145deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.4) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <LayoutDashboard size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Dashboard Interface</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section style={{ padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>The Challenge in Rural Healthcare</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Rural health data—encompassing infrastructure, health outcomes, staffing levels, and medicine stock—is often fragmented across separate systems and reported annually. As a result, critical resource allocation remains reactive instead of predictive, leaving remote populations vulnerable to preventable outbreaks and shortages.
          </p>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>How It Works</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0 }}>Intelligence derived from data, not guesswork.</p>
          </div>

          <div className="features-grid">
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShieldAlert color="var(--rose)" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>Risk Scoring</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Explainable ML-driven risk score per village.
              </p>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <TrendingUp color="var(--cyan)" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>Forecasting</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Near-term case-trend projection, not just historical reporting.
              </p>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <BellRing color="var(--amber)" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>Anomaly Detection</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Early flags when a village's case pattern breaks from its baseline.
              </p>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <GitBranch color="var(--indigo)" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>Similar-Village Clustering</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Reasoned estimates even for villages with little history.
              </p>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Settings color="var(--emerald)" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>Optimized Allocation</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                A constrained optimizer recommends the best resource plan under a real specialist, medicine, or MMU budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHO IT'S FOR */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Who It's For</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0 }}>Tailored visibility for every level of care.</p>
          </div>

          <div className="roles-grid">
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--emerald)', margin: '0 0 1rem 0' }}>Admin / Coordinator</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Oversees multi-district patterns, allocates macro-level budgets, and identifies overarching systemic weaknesses.
              </p>
            </div>
            
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--cyan)', margin: '0 0 1rem 0' }}>District Health Officer</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Monitors village-level risk tiers in real-time, routing MMUs and specialists precisely where anomalies emerge.
              </p>
            </div>
            
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--indigo)', margin: '0 0 1rem 0' }}>Field Health Worker</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Receives prioritized daily action queues, requests urgent medicines, and flags real-time incidents from the ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BAND */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' }}>See it in action</h2>
          <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', textDecoration: 'none' }}>
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '3rem 2rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              🌿 Health Intel Network
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Predictive Care for Every Village.
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Login</Link>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>GitHub / Repository</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Contact</a>
          </div>
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
            &copy; {new Date().getFullYear()} Health Intel Network. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
