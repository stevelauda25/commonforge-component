import { Sidebar } from './components/sidebar/Sidebar';
import { Topbar } from './components/topbar/Topbar';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <div className="flex min-h-screen bg-canvas text-text-primary">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
