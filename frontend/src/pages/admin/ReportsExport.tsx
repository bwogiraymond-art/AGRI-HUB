import { useMarket } from '../../context/MarketContext';
import { formatUGX }  from '../../utils/formatters';

const REPORTS = [
  {
    title:   'Daily market report',
    desc:    'Prices, volumes, quality stats for today',
    prompt:  'Generate a formal daily market report for Nakasero Market for today including all commodity prices, volumes traded, and quality verification statistics',
  },
  {
    title:   'Weekly price bulletin',
    desc:    '7-day price averages for all commodities',
    prompt:  'Generate a weekly price bulletin for Nakasero Market showing 7-day average prices for all commodities, notable trends, and recommendations for farmers',
  },
  {
    title:   'Monthly MAAIF policy brief',
    desc:    'Trends, anomalies, and policy recommendations',
    prompt:  'Generate a monthly agricultural policy brief for MAAIF based on Nakasero Market data — include price trends, supply analysis, farmer participation rates, and policy recommendations',
  },
  {
    title:   'Farmer impact assessment',
    desc:    'How the system is benefiting registered farmers',
    prompt:  'Generate a farmer impact assessment report showing how the AgriHub system has improved price transparency and farmer earnings at Nakasero Market',
  },
];

const KPIS = [
  { label:'Price data coverage',         value:'91%', target:'90%',  onTarget: true  },
  { label:'Avg verification time',        value:'14 min', target:'< 20 min', onTarget: true  },
  { label:'Farmer data completeness',     value:'78%', target:'85%', onTarget: false },
  { label:'Daily report submission rate', value:'96%', target:'100%',onTarget: false },
];

export default function ReportsExport() {
  const { prices } = useMarket();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

      {/* Report generators */}
      <div className="card">
        <div className="card-head"><h3>Generate reports</h3></div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {REPORTS.map(r => (
            <div key={r.title} style={{ padding: 14, background: 'var(--color-background-secondary)', borderRadius: 8, border: '0.5px solid var(--color-border-tertiary)' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>{r.desc}</div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
                onClick={() => window.open(`data:text/plain,${encodeURIComponent(r.prompt)}`, '_blank')}
              >
                Generate report →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="card">
        <div className="card-head"><h3>Key performance indicators</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>System health</span></div>
        <div className="card-body">

          {/* KPI rows */}
          <div style={{ marginBottom: 16 }}>
            {KPIS.map(k => (
              <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 13 }}>
                <div style={{ flex: 1 }}>{k.label}</div>
                <div style={{ fontWeight: 500, color: k.onTarget ? '#3B6D11' : '#993C1D' }}>{k.value}</div>
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4,
                  background: k.onTarget ? '#EAF3DE' : '#FCEBEB',
                  color:      k.onTarget ? '#27500A' : '#791F1F',
                }}>
                  {k.onTarget ? 'On target' : 'Below target'}
                </span>
              </div>
            ))}
          </div>

          {/* Uptime card */}
          <div style={{ background: '#EAF3DE', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#27500A', marginBottom: 4 }}>System uptime</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: '#3B6D11', lineHeight: 1 }}>99.4%</div>
            <div style={{ fontSize: 11, color: '#3B6D11', marginTop: 4 }}>Last 30 days · Target: 99%</div>
          </div>

          {/* Price snapshot for export */}
          {prices.length > 0 && (
            <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Live data snapshot
              </div>
              {prices.slice(0, 4).map(p => (
                <div key={p.crop} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{p.crop}</span>
                  <span style={{ fontWeight: 500 }}>{formatUGX(p.avgPrice)}/{p.unit}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
