import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import { useQueue } from '../../hooks/useQueue';
import { TopBar, NavTabs } from '../../components/layout';

import OfficialOverview   from './OfficialOverview';
import VerificationQueue  from './VerificationQueue';
import PriceLogging       from './PriceLogging';
import DailyReport        from './DailyReport';

export default function OfficialDashboard() {
  const { user }        = useAuth();
  const { pendingCount } = useQueue();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'queue',     label: 'Verification queue', badge: pendingCount },
    { id: 'prices',    label: 'Price logging' },
    { id: 'report',    label: 'Daily report' },
  ];

  return (
    <div data-role="official" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--color-background-tertiary)' }}>
      <TopBar role="official" userId={user.id} userName={user.name} />
      <NavTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, padding: 20 }}>
        {activeTab === 'overview' && <OfficialOverview  onNavigate={setActiveTab} />}
        {activeTab === 'queue'    && <VerificationQueue />}
        {activeTab === 'prices'   && <PriceLogging />}
        {activeTab === 'report'   && <DailyReport />}
      </main>
    </div>
  );
}
