import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Overview from './components/Dashboard/Overview';
import DistrictList from './components/Districts/DistrictList';
import DistrictForm from './components/Districts/DistrictForm';
import VillageList from './components/Villages/VillageList';
import VillageForm from './components/Villages/VillageForm';
import RecordList from './components/HealthRecords/RecordList';
import RecordForm from './components/HealthRecords/RecordForm';
import PatternList from './components/PredictivePatterns/PatternList';
import RiskDashboard from './components/RiskAnalysis/RiskDashboard';
import './App.css';
import type { ReactElement } from 'react';

import CoordinatorDashboard from './components/Roles/CoordinatorDashboard';
import FieldWorkerTasks from './components/Roles/FieldWorkerTasks';

function Protected({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleDefaultRoute() {
  const { role } = useAuth();
  if (role === 'admin') return <Navigate to="/risk-analysis" replace />;
  if (role === 'coordinator') return <Navigate to="/coordinator" replace />;
  if (role === 'worker') return <Navigate to="/tasks" replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Protected>
                <RoleDefaultRoute />
              </Protected>
            }
          />
          {/* Coordinator */}
          <Route
            path="/coordinator"
            element={
              <Protected>
                <CoordinatorDashboard />
              </Protected>
            }
          />
          {/* Worker */}
          <Route
            path="/tasks"
            element={
              <Protected>
                <FieldWorkerTasks />
              </Protected>
            }
          />
          {/* Districts */}
          <Route
            path="/districts"
            element={
              <Protected>
                <DistrictList />
              </Protected>
            }
          />
          <Route
            path="/districts/new"
            element={
              <Protected>
                <DistrictForm />
              </Protected>
            }
          />
          <Route
            path="/districts/:id/edit"
            element={
              <Protected>
                <DistrictForm />
              </Protected>
            }
          />
          {/* Villages */}
          <Route
            path="/villages"
            element={
              <Protected>
                <VillageList />
              </Protected>
            }
          />
          <Route
            path="/villages/new"
            element={
              <Protected>
                <VillageForm />
              </Protected>
            }
          />
          <Route
            path="/villages/:id/edit"
            element={
              <Protected>
                <VillageForm />
              </Protected>
            }
          />
          {/* Health Records */}
          <Route
            path="/health-records"
            element={
              <Protected>
                <RecordList />
              </Protected>
            }
          />
          <Route
            path="/health-records/new"
            element={
              <Protected>
                <RecordForm />
              </Protected>
            }
          />
          <Route
            path="/health-records/:id/edit"
            element={
              <Protected>
                <RecordForm />
              </Protected>
            }
          />
          {/* Predictive Patterns */}
          <Route
            path="/patterns"
            element={
              <Protected>
                <PatternList />
              </Protected>
            }
          />
          {/* Risk Analysis */}
          <Route
            path="/risk-analysis"
            element={
              <Protected>
                <RiskDashboard />
              </Protected>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
