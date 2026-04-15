import { useRef, useEffect, useState } from 'react';
import { usePrices } from '../../hooks/usePrices';
import { PriceRow }  from '../../components/ui';
import { formatUGX, pctChange } from '../../utils/formatters';

const DOT_COLORS = ['#639922','#3B6D11','#D85A30','#BA7517','#185FA5','#5F5E5A','#0F6E56'];
const TREND_CROPS = ['Maize','Beans','Tomatoes','Cassava','Onions'];

export default function MarketPrices() {
  const { prices, trends, getTrendByCrop } = usePrices();
  const [selectedCrop, setSelectedCrop] = useState('Maize');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<unknown>(null);

  const now = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const trend = getTrendByCrop(selectedCrop);
    if (!trend || !chartRef.current) return;

    // Dynamically import Chart.js to avoid SSR issues
    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartInst.current) (chartInst.current as { destroy: () => void }).destroy();
      const labels = ['D-6','D-5','D-4','D-3','D-2','D-1','Today'];
      chartInst.current = new Chart(chartRef.current!, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            data: trend.data,
            borderColor: '#3B6D11',
            backgroundColor: 'rgba(59,109,17,0.08)',
            borderWidth: 2,
            pointBackgroundColor: '#3B6D11',
            pointRadius: 3,
            tension: 0.35,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (v: { parsed: { y: number } }) => formatUGX(Math.round(v.parsed.y)) + '/kg' } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { font: { size: 11 }, callback: (v: unknown) => 'UGX ' + Math.round(Number(v) / 1000) + 'K' },
            },
          },
        },
      });
    });

    return () => {
      if (chartInst.current) (chartInst.current as { destroy: () => void }).destroy();
      chartInst.current = null;
    };
  }, [selectedCrop]);

  const trend      = getTrendByCrop(selectedCrop);
  const trendData  = trend?.data ?? [];
  const curPrice   = trendData[trendData.length - 1] ?? 0;
  const firstPrice = trendData[0] ?? curPrice;
  const chg        = pctChange(curPrice, firstPrice);
  const advice     = chg > 5 ? 'Good time to sell' : chg < -5 ? 'Wait for prices to recover' : 'Stable — sell now';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

      {/* Live price board */}
      <div className="card">
        <div className="card-head">
          <h3>Live commodity prices</h3>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Updated {now}</span>
        </div>
        <div style={{ padding: '8px 18px 14px' }}>
          {prices.map((p, i) => (
            <PriceRow
              key={p.crop}
              price={p}
              trend={trends.find(t => t.crop === p.crop)}
              dotColor={DOT_COLORS[i % DOT_COLORS.length]}
            />
          ))}
        </div>
      </div>

      {/* 7-day trend chart */}
      <div className="card">
        <div className="card-head">
          <h3>7-day price trend</h3>
          <span style={{ fontSize: 11, color: 'var(--role-color)' }}>{selectedCrop}</span>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: 10 }}>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              style={{ width: '100%', fontSize: 12, padding: '5px 8px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 5, fontFamily: 'inherit', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
            >
              {TREND_CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ position: 'relative', height: 160 }}>
            <canvas ref={chartRef} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>7 days ago</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Today</span>
          </div>

          {/* Summary row */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, padding: 10, background: 'var(--color-background-secondary)', borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Current avg</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {formatUGX(curPrice)}/kg
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>7-day change</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: chg > 0 ? '#3B6D11' : chg < 0 ? '#A32D2D' : 'var(--color-text-secondary)' }}>
                {(chg > 0 ? '+' : '') + chg + '%'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Market advice</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{advice}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
