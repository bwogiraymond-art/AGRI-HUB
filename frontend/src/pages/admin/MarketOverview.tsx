import { useRef, useEffect } from 'react';
import { useMarket }   from '../../context/MarketContext';
import { usePrices }   from '../../hooks/usePrices';
import { StatCard, PriceRow, InsightCard } from '../../components/ui';
import { formatUGX }   from '../../utils/formatters';

const DISTRICT_DATA = [
  { name: 'Wakiso', pct: 28 }, { name: 'Mukono', pct: 21 },
  { name: 'Mpigi',  pct: 16 }, { name: 'Masaka', pct: 14 },
  { name: 'Jinja',  pct: 11 }, { name: 'Others', pct: 10 },
];
const COMMODITY_COLORS = ['#BA7517','#3B6D11','#993C1D','#0F6E56','#185FA5','#5F5E5A'];
const DOT_COLORS       = ['#639922','#3B6D11','#D85A30','#BA7517','#185FA5','#5F5E5A'];

export default function MarketOverview() {
  const { summary }        = useMarket();
  const { prices, trends } = usePrices();

  const txRef   = useRef<HTMLCanvasElement>(null);
  const donutRef= useRef<HTMLCanvasElement>(null);
  const txInst  = useRef<unknown>(null);
  const donutInst=useRef<unknown>(null);

  useEffect(() => {
    import('chart.js/auto').then(({ default: Chart }) => {
      // Transaction volume bar chart
      if (txRef.current && !txInst.current) {
        const data = Array.from({ length: 30 }, (_, i) =>
          Math.floor(40 + Math.random() * 110 + i * 1.5)
        );
        txInst.current = new Chart(txRef.current, {
          type: 'bar',
          data: {
            labels: data.map((_, i) => {
              const d = new Date(); d.setDate(d.getDate() - 29 + i);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }),
            datasets: [{ data, backgroundColor: data.map(v => v > 110 ? '#BA7517' : '#FAEEDA'), borderRadius: 3, borderSkipped: false }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 10 } },
              y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } },
            },
          },
        });
      }

      // Donut chart
      if (donutRef.current && !donutInst.current) {
        const crops   = ['Maize','Beans','Tomatoes','Cassava','Onions','Groundnuts'];
        const volumes = [38, 28, 14, 22, 19, 12];
        donutInst.current = new Chart(donutRef.current, {
          type: 'doughnut',
          data: { labels: crops, datasets: [{ data: volumes, backgroundColor: COMMODITY_COLORS, borderWidth: 0 }] },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '62%',
            plugins: { legend: { display: true, position: 'right', labels: { font: { size: 11 }, padding: 10, boxWidth: 10 } } },
          },
        });
      }
    });
    return () => {
      if (txInst.current)    (txInst.current as { destroy:()=>void }).destroy();
      if (donutInst.current) (donutInst.current as { destroy:()=>void }).destroy();
    };
  }, []);

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['7 days','30 days','90 days','1 year'].map((r, i) => (
            <button key={r} className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 10px', background: i === 1 ? '#FAEEDA' : undefined, color: i === 1 ? '#633806' : undefined, borderColor: i === 1 ? '#FAC775' : undefined }}>
              {r}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12 }}>
          Export summary
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
        <StatCard label="Total transactions"      value={summary.totalTransactions.toLocaleString()} sub="↑ 18% vs last period" subColor="green" />
        <StatCard label="Total volume traded"     value={`${summary.totalVolumeTonnes} t`}            sub="↑ 11% vs last period" subColor="green" />
        <StatCard label="Avg market turnover"     value={formatUGX(summary.weeklyTurnoverUGX, true)}  sub="Per week" />
        <StatCard label="Active registered farmers" value={summary.activeFarmers}                    sub="↑ 24 new this month"  subColor="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        {/* Transaction chart */}
        <div className="card">
          <div className="card-head"><h3>Transaction volume — 30 days</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Daily count</span></div>
          <div className="card-body"><div style={{ height: 160 }}><canvas ref={txRef} /></div></div>
        </div>

        {/* Insights */}
        <div className="card">
          <div className="card-head"><h3>Market intelligence</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Auto-generated</span></div>
          <div className="card-body" style={{ padding: '14px 18px' }}>
            <InsightCard variant="warn" title="Tomato price volatility"    body="Prices rose 28% over 7 days — possible supply disruption from Mukono. Recommend investigation." />
            <InsightCard variant="ok"   title="Bean supply improving"      body="Volume up 22% — Wakiso and Mpigi harvests entering market. Price stabilising." />
            <InsightCard variant="info" title="New farmer registrations"   body="24 new farmers registered this month — highest since system launch. Onboarding effective." />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
        {/* Donut */}
        <div className="card">
          <div className="card-head"><h3>Commodity share by volume</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>This period</span></div>
          <div className="card-body"><div style={{ height: 180 }}><canvas ref={donutRef} /></div></div>
        </div>

        {/* Districts */}
        <div className="card">
          <div className="card-head"><h3>Supply by source district</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Top origins</span></div>
          <div style={{ padding: '8px 18px 14px' }}>
            {DISTRICT_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 13 }}>
                <div style={{ flex: 1, fontWeight: 500 }}>{d.name}</div>
                <div style={{ width: 100, height: 6, background: 'var(--color-background-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(d.pct / 28) * 100}%`, height: '100%', background: '#854F0B', borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', minWidth: 32, textAlign: 'right' }}>{d.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
