import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

export default function Layout({ children, title, actions }: Props) {
  const { logout, role } = useAuth();
  const location = useLocation();

  const navItems = [];
  if (role === 'Admin') {
    navItems.push(
      { to: '/dashboard/admin', icon: '🗺️', label: 'Admin Overview' },
      { to: '/districts', icon: '🏛️', label: 'Districts' },
      { to: '/villages', icon: '🏘️', label: 'Villages' },
      { to: '/health-records', icon: '🩺', label: 'Health Records' },
      { to: '/patterns', icon: '🔬', label: 'Predictive Patterns' }
    );
  } else if (role === 'District Health Officer') {
    navItems.push(
      { to: '/dashboard/officer', icon: '📍', label: 'District Operations' },
      { to: '/villages', icon: '🏘️', label: 'Villages' }
    );
  } else if (role === 'Field Health Worker') {
    navItems.push(
      { to: '/dashboard/field', icon: '✅', label: 'Field Tasks' }
    );
  } else {
    navItems.push({ to: '/', icon: '📊', label: 'Dashboard', exact: true });
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌿</div>
          <div className="sidebar-logo-text">
            <h2>Health Intel</h2>
            <span>Rural Network</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Navigation</span>
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link" style={{ width: '100%' }} onClick={logout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="page-header">
          <h1>{title}</h1>
          {actions && <div style={{ display: 'flex', gap: '0.75rem' }}>{actions}</div>}
        </header>
        <div className="page-body">{children}</div>
      </main>
    </div>
  );
}
