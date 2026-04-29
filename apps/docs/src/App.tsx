import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/shell/Sidebar.js';
import { SidebarDrawer } from './components/shell/SidebarDrawer.js';
import { Topbar } from './components/shell/Topbar.js';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar onMenuClick={() => setDrawerOpen(true)} />
      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 overflow-x-clip">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
