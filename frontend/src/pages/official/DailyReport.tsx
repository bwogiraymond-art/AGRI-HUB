import { useMarket } from '../../context/MarketContext';
import { todayLabel } from '../../utils/formatters';

export default function DailyReport() {
  const { prices, summary, activityLog } = useMarket();

  const totalVolumeKg = prices.reduce((sum, p) => sum + p.volumeKg, 0);

  const KPI_DATA = [
    { label: 'Total produce verified',  value: summary.verifiedToday + summary.flaggedToday, sub: 'Submissions today' },
    { label: 'Total volume (est.)',      value: totalVolumeKg > 0 ? `${(totalVolumeKg / 1000).toFixed(1)} t` : '—', sub: 'All commodities' },
    { label: 'Commodities traded',       value: prices.length,              sub: 'Distinct crops' },
    {
      label: 'Quality pass rate',
      value: summary.verifiedToday + summary.flaggedToday > 0
        ? Math.round((summary.verifiedToday / (summary.verifiedToday + summary.flaggedToday)) * 100) + '%'
        : '—',
      sub: 'Grade A–C cleared',
    },
  ];

  return (
    <div className="card">
      <div className="card-head">
        <h3>Daily market report summary</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{todayLabel()}</span>
          <button
            className="btn btn-primary"
            style={{ fontSize: 11, padding: '5px 12px' }}
            onClick={() => window.print()}
          >
            Print / export
          </button>
        </div>
      </div>

      <div style={{ padding: 18 }}>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
          {KPI_DATA.map(k => (
            <div key={k.label} style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Price summary table */}
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
            Price summary — today
          </div>
          {prices.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>No prices logged yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Commodity','Min','Avg','Max','Vol (kg)','Supply'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Commodity' ? 'left' : 'right', fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 500, padding: '6px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p.crop}>
                    <td style={{ padding: '7px 0', fontWeight: 500, borderBottom: '0.5px solid var(--color-border-tertiary)' }}>{p.crop}</td>
                    <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--color-text-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>{p.minPrice.toLocaleString()}</td>
                    <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 500, borderBottom: '0.5px solid var(--color-border-tertiary)' }}>{p.avgPrice.toLocaleString()}</td>
                    <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--color-text-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>{p.maxPrice.toLocaleString()}</td>
                    <td style={{ padding: '7px 0', textAlign: 'right', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>{p.volumeKg.toLocaleString()}</td>
                    <td style={{ padding: '7px 0', textAlign: 'right', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>{p.supplyLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent activity */}
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
            Activity log — today
          </div>
          {activityLog.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>No activity recorded yet.</p>
          )}
          {[...activityLog].reverse().map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 13 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>{a.text}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono,monospace)', whiteSpace: 'nowrap' }}>{a.time}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
