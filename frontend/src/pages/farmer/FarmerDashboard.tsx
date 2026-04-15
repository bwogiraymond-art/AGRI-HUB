import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TopBar, NavTabs } from '../../components/layout';

import FarmerOverview  from './FarmerOverview';
import RegisterProduce from './RegisterProduce';
import MarketPrices    from './MarketPrices';
import FarmerHistory   from './FarmerHistory';

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'register',  label: 'Register produce' },
  { id: 'prices',    label: 'Market prices' },
  { id: 'history',   label: 'My history' },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  return (
    // data-role scopes CSS token --role-color to green
    <div data-role="farmer" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--color-background-tertiary)' }}>
      <TopBar role="farmer" userId={user.id} userName={user.name} />
      <NavTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, padding: 20 }}>
        {activeTab === 'overview'  && <FarmerOverview  onNavigate={setActiveTab} />}
        {activeTab === 'register'  && <RegisterProduce />}
        {activeTab === 'prices'    && <MarketPrices />}
        {activeTab === 'history'   && <FarmerHistory />}
      </main>
    </div>
  );
}
