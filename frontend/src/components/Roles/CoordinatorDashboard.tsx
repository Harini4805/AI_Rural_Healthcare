import Layout from '../Layout';

export default function CoordinatorDashboard() {
  return (
    <Layout title="Operations Dashboard">
      <div className="glass" style={{ padding: '2rem' }}>
        <h2>Coordinator View</h2>
        <p>This is a placeholder for the Health Coordinator operational dashboard.</p>
        <p>Features to be implemented based on the PRD:</p>
        <ul>
          <li>View assigned cluster priorities</li>
          <li>Monitor real-time inventory levels</li>
          <li>Coordinate mobile unit schedules</li>
        </ul>
      </div>
    </Layout>
  );
}
