import { useState } from 'react';
import AuthGuard from './components/Auth/AuthGuard';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Store from './pages/Store';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import AdminSettings from './pages/AdminSettings';
import { PageType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const pageConfig: Record<PageType, { title: string; subtitle: string; component: JSX.Element }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your business metrics and performance',
      component: <Dashboard />,
    },
    pos: {
      title: 'Point of Sale',
      subtitle: 'Process transactions and manage sales',
      component: <POS />,
    },
    inventory: {
      title: 'Inventory Management',
      subtitle: 'Track and manage your product stock',
      component: <Inventory />,
    },
    store: {
      title: 'Online Store',
      subtitle: 'Browse products and manage your storefront',
      component: <Store />,
    },
    users: {
      title: 'User Management',
      subtitle: 'Manage team members and permissions',
      component: <Users />,
    },
    reports: {
      title: 'Reports &amp; Analytics',
      subtitle: 'View insights and generate reports',
      component: <Reports />,
    },
    documents: {
      title: 'Documents',
      subtitle: 'View, download, and print your business documents',
      component: <Documents />,
    },
    settings: {
      title: 'Admin Settings',
      subtitle: 'Manage company details and receipt configurations',
      component: <AdminSettings />,
    },
  };

  const currentConfig = pageConfig[currentPage];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={currentConfig.title} subtitle={currentConfig.subtitle} onNavigate={setCurrentPage} />

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
              {currentConfig.component}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default App;
