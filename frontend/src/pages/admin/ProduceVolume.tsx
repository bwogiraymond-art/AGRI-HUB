import { useRef, useEffect } from 'react';
import { formatUGX } from '../../utils/formatters';

const COMMODITY_COLORS = ['#BA7517','#3B6D11','#993C1D','#0F6E56','#185FA5','#5F5E5A'];
const COMMODITIES      = ['Maize','Beans','Tomatoes','Cassava','Onions','Groundnuts'];
const REVENUE_DATA     = [45.6, 61.3, 25.2, 12.8, 50.4, 33.0];
const GRADE_DATA       = [48, 32, 13, 7];
const GRADE_COLORS     = ['#3B6D11','#185FA5','#BA7517','#993C1D'];
const GRADE_LABELS     = ['Grade A','Grade B','Grade C','Rejected'];
const VOLUME_DATA      = [18, 21, 19, 24, 22, 28, 26, 31];
const WEEK_LABELS      = ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'];

export default function ProduceVolume() {
  const volRef  = useRef<HTMLCanvasElement>(null);
  const gradeRef= useRef<HTMLCanvasElement>(null);
  const revRef  = useRef<HTMLCanvasElement>(null);
  const volInst  = useRef<unknown>(null);
  const gradeInst= useRef<unknown>(null);
  const revInst  = useRef<unknown>(null);

  useEffect(() => {
    import('chart.js/auto').then(({ default: Chart }) => {
      if (volRef.current && !volInst.current) {
        volInst.current = new Chart(volRef.current, {
          type: 'bar',
          data: { labels: WEEK_LABELS, datasets: [{ data: VOLUME_DATA, backgroundColor: '#EAF3DE', borderColor: '#3B6D11', borderWidth: 1, borderRadius: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, callback: (v: unknown) => v + 't' } } } },
        });
      }
      if (gradeRef.current && !gradeInst.current) {
        gradeInst.current = new Chart(gradeRef.current, {
          type: 'bar',
          data: { labels: GRADE_LABELS, datasets: [{ data: GRADE_DATA, backgroundColor: GRADE_COLORS, borderRadius: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } } } },
        });
      }
      if (revRef.current && !revInst.current) {
        revInst.current = new Chart(revRef.current, {
          type: 'bar',
          data: { labels: COMMODITIES, datasets: [{ data: REVENUE_DATA, backgroundColor: COMMODITY_COLORS, borderRadius: 4 }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (v: { parsed: { y: number } }) => 'UGX ' + v.parsed.y.toFixed(1) + 'M' } } },
            scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, callback: (v: unknown) => 'UGX ' + v + 'M' } } },
          },
        });
      }
    });
    return () => {
      [volInst, gradeInst, revInst].forEach(r => { if (r.current) (r.current as { destroy:()=>void }).destroy(); });
    };
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-head"><h3>Weekly volume traded (tonnes)</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Last 8 weeks</span></div>
          <div className="card-body"><div style={{ height: 180 }}><canvas ref={volRef} /></div></div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Quality grade distribution</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>All verified produce</span></div>
          <div className="card-body"><div style={{ height: 180 }}><canvas ref={gradeRef} /></div></div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Top commodities by revenue (UGX)</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Estimated market value — this month</span></div>
        <div className="card-body"><div style={{ height: 140 }}><canvas ref={revRef} /></div></div>
      </div>
    </div>
  );
}
