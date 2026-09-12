import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import { useAuth } from './hooks/useAuth';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Roles/AdminDashboard';
import OfficerDashboard from './components/Roles/OfficerDashboard';
import FieldWorkerDashboard from './components/Roles/FieldWorkerDashboard';
import DistrictList from './components/Districts/DistrictList';
import DistrictForm from './components/Districts/DistrictForm';
import VillageList from './components/Villages/VillageList';
import VillageForm from './components/Villages/VillageForm';
import RecordList from './components/HealthRecords/RecordList';
import RecordForm from './components/HealthRecords/RecordForm';
import PatternList from './components/PredictivePatterns/PatternList';
import './App.css';
import type { ReactElement } from 'react';

function Protected({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboards */}
          <Route
            path="/dashboard/admin"
            element={
              <Protected>
                <AdminDashboard />
              </Protected>
            }
          />
          <Route
            path="/dashboard/officer"
            element={
              <Protected>
                <OfficerDashboard />
              </Protected>
            }
          />
          <Route
            path="/dashboard/field"
            element={
              <Protected>
                <FieldWorkerDashboard />
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
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
