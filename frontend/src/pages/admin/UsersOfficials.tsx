import { useRef, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';

const OFFICIALS = [
  { id:'KCCA-OFF-019', name:'Amara Kato',    initials:'AK', verified:9,  bg:'#E6F1FB', color:'#0C447C' },
  { id:'KCCA-OFF-007', name:'Peter Ssali',   initials:'PS', verified:12, bg:'#EAF3DE', color:'#27500A' },
  { id:'KCCA-OFF-023', name:'Grace Nabifo',  initials:'GN', verified:7,  bg:'#FAEEDA', color:'#633806' },
  { id:'KCCA-OFF-011', name:'Moses Okot',    initials:'MO', verified:14, bg:'#E1F5EE', color:'#085041' },
];

const FARMERS = [
  { id:'NKS-F-00142', name:'Lwanga Cyrus',  district:'Wakiso', date:'12 Apr', crop:'Beans'      },
  { id:'NKS-F-00178', name:'Namusoke Ruth', district:'Jinja',  date:'11 Apr', crop:'Onions'     },
  { id:'NKS-F-00055', name:'Okello James',  district:'Lira',   date:'10 Apr', crop:'Groundnuts' },
  { id:'NKS-F-00201', name:'Bwogi Raymond', district:'Masaka', date:'09 Apr', crop:'Maize'      },
  { id:'NKS-F-00089', name:'Taka Erina',    district:'Mukono', date:'08 Apr', crop:'Tomatoes'   },
  { id:'NKS-F-00317', name:'Nadundu Sarah', district:'Mpigi',  date:'07 Apr', crop:'Cassava'    },
];

const TEAL_PILL = { bg:'#E1F5EE', color:'#085041' };

export default function UsersOfficials() {
  const { summary } = useMarket();
  const growthRef   = useRef<HTMLCanvasElement>(null);
  const growthInst  = useRef<unknown>(null);

  useEffect(() => {
    import('chart.js/auto').then(({ default: Chart }) => {
      if (growthRef.current && !growthInst.current) {
        growthInst.current = new Chart(growthRef.current, {
          type: 'line',
          data: {
            labels: ['Jan','Feb','Mar','Apr'],
            datasets: [
              { label:'Farmers', data:[280,305,317,341], borderColor:'#3B6D11', backgroundColor:'rgba(59,109,17,0.07)', tension:0.4, fill:true, borderWidth:2, pointRadius:3 },
              { label:'Traders', data:[98, 108,118,128], borderColor:'#0F6E56', borderWidth:2, tension:0.4, pointRadius:3, fill:false },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { font: { size: 10 }, boxWidth: 10 } } },
            scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } } },
          },
        });
      }
    });
    return () => { if (growthInst.current) (growthInst.current as { destroy:()=>void }).destroy(); };
  }, []);

  const ROLE_STATS = [
    { label:'Farmers',          value: summary.activeFarmers, bg:'#EAF3DE', color:'#27500A' },
    { label:'Traders',          value: 128,                   bg:'#E1F5EE', color:'#085041' },
    { label:'Market officials', value: 12,                    bg:'#E6F1FB', color:'#0C447C' },
    { label:'Admin accounts',   value: 4,                     bg:'#FAEEDA', color:'#633806' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>

        {/* User counts + growth chart */}
        <div className="card">
          <div className="card-head"><h3>Registered users</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>By role</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {ROLE_STATS.map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, color: s.color, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 140 }}><canvas ref={growthRef} /></div>
          </div>
        </div>

        {/* Officials on duty */}
        <div className="card">
          <div className="card-head">
            <h3>Market officials on duty</h3>
            <span style={{ fontSize: 11, color: '#3B6D11' }}>12 active</span>
          </div>
          <div style={{ padding: '8px 18px 14px' }}>
            {OFFICIALS.map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 13 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: o.bg, color: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, flexShrink: 0 }}>
                  {o.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{o.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono,monospace)' }}>{o.id}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: '#EAF3DE', color: '#27500A' }}>
                  {o.verified} verified
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent farmer registrations */}
      <div className="card">
        <div className="card-head"><h3>Recent farmer registrations</h3><span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Latest 6</span></div>
        <div style={{ padding: '8px 18px 14px' }}>
          {FARMERS.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: 13 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EAF3DE', color: '#27500A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, flexShrink: 0 }}>
                {f.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono,monospace)' }}>{f.id} · {f.district}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: TEAL_PILL.bg, color: TEAL_PILL.color, whiteSpace: 'nowrap' }}>
                {f.crop}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 4 }}>{f.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
