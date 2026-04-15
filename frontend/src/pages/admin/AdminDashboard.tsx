import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import TopBar  from '../../components/layout/TopBar';
import NavTabs from '../../components/layout/NavTabs';


import MarketOverview  from './MarketOverview';
import PriceAnalytics  from './PriceAnalytics';
import ProduceVolume   from './ProduceVolume';
import UsersOfficials  from './UsersOfficials';
import ReportsExport   from './ReportsExport';

const TABS = [
  { id: 'overview',  label: 'Market overview' },
  { id: 'prices',    label: 'Price analytics' },
  { id: 'produce',   label: 'Produce & volume' },
  { id: 'users',     label: 'Users & officials' },
  { id: 'reports',   label: 'Reports & export' },
];

export default function AdminDashboard() {
  const { user }    = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  return (
    <div data-role="admin" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--color-background-tertiary)' }}>
      <TopBar role="admin" userId={user.id} userName={user.name} />
      <NavTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, padding: 20 }}>
        {activeTab === 'overview' && <MarketOverview />}
        {activeTab === 'prices'   && <PriceAnalytics />}
        {activeTab === 'produce'  && <ProduceVolume />}
        {activeTab === 'users'    && <UsersOfficials />}
        {activeTab === 'reports'  && <ReportsExport />}
      </main>
    </div>
  );
}
