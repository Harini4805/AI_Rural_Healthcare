import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@healthnet.com');
  const [password, setPassword] = useState('Admin@123');
  const [selectedRole, setSelectedRole] = useState('District Health Officer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, selectedRole);
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      {/* Left Panel */}
      <div className="split-left">
        <div className="split-left-content">
          <div className="split-left-logo">
            <div className="split-left-logo-icon">🌿</div>
            <h1>Health Intel Network</h1>
          </div>
          <p>Predictive Care for Every Village.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="split-right">
        <div className="split-right-content">
          <div className="split-right-logo">
            <div className="icon">🌿</div>
            <span>Health Intel Network</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            Login
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Log in to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Log in as:</label>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {['Admin', 'District Health Officer', 'Field Health Worker'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: selectedRole === role ? 600 : 400,
                      color: selectedRole === role ? 'var(--bg-card)' : 'var(--text-secondary)',
                      background: selectedRole === role ? 'var(--cyan)' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <a href="#" style={{ fontSize: '0.875rem', color: 'var(--indigo)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}
            >
              <span style={{ marginRight: '0.5rem', fontWeight: 'bold', color: '#EA4335' }}>G</span> Log in with Google
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <a href="#" style={{ color: 'var(--indigo)', fontWeight: 600, textDecoration: 'none' }}>
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
