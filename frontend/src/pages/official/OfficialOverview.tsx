import { useMarket } from '../../context/MarketContext';
import { useQueue }  from '../../hooks/useQueue';
import { StatCard, StatusPill } from '../../components/ui';
import { formatDate } from '../../utils/formatters';

interface OfficialOverviewProps {
  onNavigate: (tab: string) => void;
}

export default function OfficialOverview({ onNavigate }: OfficialOverviewProps) {
  const { summary, activityLog } = useMarket();
  const { pendingItems }         = useQueue();

  const nextFour = pendingItems.slice(0, 4);

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
        <StatCard label="Pending verification" value={summary.pendingVerifications} sub="Awaiting your review"  subColor="red"   />
        <StatCard label="Verified today"        value={summary.verifiedToday}        sub="Grade A–C cleared"    subColor="green" />
        <StatCard label="Prices logged"         value={`${summary.pricesLoggedToday} / ${summary.totalCommodities}`} sub="Commodities today" />
        <StatCard label="Flagged / rejected"    value={summary.flaggedToday}         sub="Quality concerns"     subColor="amber" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

        {/* Next in queue */}
        <div className="card">
          <div className="card-head">
            <h3>Next in queue</h3>
            <span style={{ fontSize: 11, color: 'var(--role-color)', cursor: 'pointer' }} onClick={() => onNavigate('queue')}>
              View all →
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 400 }}>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Crop</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {nextFour.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                      Queue is clear
                    </td>
                  </tr>
                )}
                {nextFour.map(item => (
                  <tr key={item.ref}>
                    <td style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11 }}>
                      {item.ref.slice(0, 12)}
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.crop}</td>
                    <td>{item.quantityKg} kg</td>
                    <td><StatusPill status={item.status} /></td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: 11, padding: '3px 10px' }}
                        onClick={() => onNavigate('queue')}
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity log */}
        <div className="card">
          <div className="card-head">
            <h3>Today's activity log</h3>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div style={{ padding: '4px 18px 14px' }}>
            {[...activityLog].reverse().slice(0, 7).map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '9px 0',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
                <div style={{ flex: 1, fontSize: 13, color: 'var(--color-text-primary)' }}>{a.text}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{a.time}</div>
              </div>
            ))}
            {activityLog.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', padding: '12px 0' }}>No activity yet today.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
