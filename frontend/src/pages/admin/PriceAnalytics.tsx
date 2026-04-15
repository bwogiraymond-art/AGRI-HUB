import { useRef, useEffect, useState } from 'react';
import { usePrices } from '../../hooks/usePrices';
import { PriceRow }  from '../../components/ui';
import { formatUGX } from '../../utils/formatters';

const TREND_DATA: Record<string, number[]> = {
  Maize:    [1050,1100,1080,1150,1100,1180,1200],
  Beans:    [3700,3650,3600,3550,3580,3500,3500],
  Tomatoes: [2200,2300,2500,2600,2700,2750,2800],
  Cassava:  [800, 810, 790, 800, 800, 800, 800 ],
  Onions:   [3900,4000,4050,4100,4000,4150,4200],
};
const CROPS    = Object.keys(TREND_DATA);
const DOT_COLORS = ['#639922','#3B6D11','#D85A30','#BA7517','#185FA5','#5F5E5A'];
const VOL_DATA   = [8.2, 4.1, 18.7, 2.3, 6.8, 3.5];

export default function PriceAnalytics() {
  const { prices, trends } = usePrices();
  const [cropA, setCropA] = useState('Maize');
  const [cropB, setCropB] = useState('Beans');

  const lineRef  = useRef<HTMLCanvasElement>(null);
  const volRef   = useRef<HTMLCanvasElement>(null);
  const lineInst = useRef<unknown>(null);
  const volInst  = useRef<unknown>(null);

  // Volatility chart — mount once
  useEffect(() => {
    import('chart.js/auto').then(({ default: Chart }) => {
      if (volRef.current && !volInst.current) {
        const COMMODITY_COLORS = ['#BA7517','#3B6D11','#993C1D','#0F6E56','#185FA5','#5F5E5A'];
        volInst.current = new Chart(volRef.current, {
          type: 'bar',
          data: {
            labels: ['Maize','Beans','Tomatoes','Cassava','Onions','Groundnuts'],
            datasets: [{
              data: VOL_DATA,
              backgroundColor: COMMODITY_COLORS.map(c => c + '33'),
              borderColor: COMMODITY_COLORS,
              borderWidth: 1, borderRadius: 4,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, callback: (v: unknown) => v + '%' } },
            },
          },
        });
      }
    });
    return () => { if (volInst.current) (volInst.current as { destroy:()=>void }).destroy(); };
  }, []);

  // Line chart — re-render when crop selection changes
  useEffect(() => {
    import('chart.js/auto').then(({ default: Chart }) => {
      if (!lineRef.current) return;
      if (lineInst.current) (lineInst.current as { destroy:()=>void }).destroy();
      lineInst.current = new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: ['D-6','D-5','D-4','D-3','D-2','D-1','Today'],
          datasets: [
            { label: cropA, data: TREND_DATA[cropA], borderColor: '#BA7517', backgroundColor: 'rgba(186,117,23,0.07)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 },
            { label: cropB, data: TREND_DATA[cropB], borderColor: '#0F6E56', backgroundColor: 'rgba(15,110,86,0.07)',  tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { font: { size: 10 }, boxWidth: 10 } },
            tooltip: { callbacks: { label: (v: { dataset: { label?: string }; parsed: { y: number | null } }) => `${v.dataset.label ?? 'Price'}: ${formatUGX(Math.round(v.parsed.y ?? 0))}/kg` } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, callback: (v: unknown) => 'UGX ' + Math.round(Number(v) / 1000) + 'K' } },
          },
        },
      });
    });
  }, [cropA, cropB]);

  const now = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>

        {/* Line chart */}
        <div className="card">
          <div className="card-head">
            <h3>Price trend — multi-commodity</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['A','B'] as const).map(side => (
                <select
                  key={side}
                  value={side === 'A' ? cropA : cropB}
                  onChange={e => side === 'A' ? setCropA(e.target.value) : setCropB(e.target.value)}
                  style={{ fontSize: 12, padding: '4px 6px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 4, fontFamily: 'inherit', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
                >
                  {CROPS.map(c => <option key={c}>{c}</option>)}
                </select>
              ))}
            </div>
          </div>
          <div className="card-body"><div style={{ height: 200 }}><canvas ref={lineRef} /></div></div>
        </div>

        {/* Live price board */}
        <div className="card">
          <div className="card-head">
            <h3>Current price board</h3>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Updated {now}</span>
          </div>
          <div style={{ padding: '8px 18px 14px' }}>
            {prices.map((p, i) => (
              <PriceRow key={p.crop} price={p} trend={trends.find(t => t.crop === p.crop)} dotColor={DOT_COLORS[i % DOT_COLORS.length]} />
            ))}
          </div>
        </div>
      </div>

      {/* Volatility chart */}
      <div className="card">
        <div className="card-head">
          <h3>Price volatility index</h3>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Std deviation of daily prices — last 30 days</span>
        </div>
        <div className="card-body"><div style={{ height: 140 }}><canvas ref={volRef} /></div></div>
      </div>
    </div>
  );
}
