import { useState }  from 'react';
import { useAuth }   from '../../context/AuthContext';
import { useMarket } from '../../context/MarketContext';
import { useToast }  from '../../hooks/useToast';
import { Toast }     from '../../components/ui';
import { formatUGX, todayLabel } from '../../utils/formatters';
import type { PriceRecord, PriceUnit, SupplyLevel } from '../../types/market.types';

const CROPS: string[]        = ['Maize','Beans','Tomatoes','Cassava','Sweet potato','Sorghum','Groundnuts','Onions','Cabbage','Bananas (matoke)','Millet'];
const UNITS: PriceUnit[]     = ['per kg','per bunch','per bag (100kg)','per crate'];
const SUPPLY: SupplyLevel[]  = ['Low','Moderate','High','Surplus'];

export default function PriceLogging() {
  const { user }            = useAuth();
  const { prices, addPrice, addActivity, summary } = useMarket();
  const { toasts, show }    = useToast();

  const [crop,   setCrop]   = useState('');
  const [unit,   setUnit]   = useState<PriceUnit>('per kg');
  const [min,    setMin]    = useState('');
  const [max,    setMax]    = useState('');
  const [avg,    setAvg]    = useState('');
  const [vol,    setVol]    = useState('');
  const [supply, setSupply] = useState<SupplyLevel | ''>('');
  const [notes,  setNotes]  = useState('');

  const handleLog = () => {
    if (!crop || !avg) { show('Please select a commodity and enter an average price.', 'warning'); return; }
    const avgNum = parseInt(avg);
    const record: PriceRecord = {
      id:             `p-${Date.now()}`,
      crop,
      unit,
      minPrice:       parseInt(min) || avgNum,
      maxPrice:       parseInt(max) || avgNum,
      avgPrice:       avgNum,
      prevAvgPrice:   prices.find(p => p.crop === crop)?.avgPrice ?? avgNum,
      volumeKg:       parseInt(vol) || 0,
      supplyLevel:    supply || 'Moderate',
      loggedAt:       new Date().toISOString(),
      officialId:     user?.id ?? '',
      notes,
    };
    addPrice(record);
    const time = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
    addActivity({ text: `Price logged: ${crop} at ${formatUGX(avgNum)}/${unit}`, time, color: '#185FA5' });
    show(`${crop} price logged — ${formatUGX(avgNum)} ${unit}`, 'success');
    setCrop(''); setUnit('per kg'); setMin(''); setMax(''); setAvg(''); setVol(''); setSupply(''); setNotes('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

      {/* Log form */}
      <div className="card">
        <div className="card-head">
          <h3>Log today's prices</h3>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{todayLabel()}</span>
        </div>
        <div className="card-body">
          {toasts.map(t => <Toast key={t.id} message={t.message} variant={t.variant} />)}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Commodity</label>
              <select value={crop} onChange={e => setCrop(e.target.value)}>
                <option value="">Select commodity...</option>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit</label>
              <select value={unit} onChange={e => setUnit(e.target.value as PriceUnit)}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Minimum price (UGX)</label>
              <input type="number" value={min} onChange={e => setMin(e.target.value)} placeholder="e.g. 900" min="0" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Maximum price (UGX)</label>
              <input type="number" value={max} onChange={e => setMax(e.target.value)} placeholder="e.g. 1500" min="0" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Prevailing / average price (UGX)</label>
            <input type="number" value={avg} onChange={e => setAvg(e.target.value)} placeholder="e.g. 1200" min="0" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Volume traded (kg est.)</label>
              <input type="number" value={vol} onChange={e => setVol(e.target.value)} placeholder="e.g. 2400" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Supply level</label>
              <select value={supply} onChange={e => setSupply(e.target.value as SupplyLevel)}>
                <option value="">Select...</option>
                {SUPPLY.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. High supply from Wakiso, prices falling..." />
          </div>

          <button className="btn btn-primary btn-full" onClick={handleLog}>
            Log price record →
          </button>
        </div>
      </div>

      {/* Logged prices panel */}
      <div className="card">
        <div className="card-head">
          <h3>Logged today</h3>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {prices.length} of {summary.totalCommodities} commodities
          </span>
        </div>
        <div style={{ padding: '14px 18px' }}>
          {prices.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>No prices logged yet today.</p>
          )}
          {prices.map(p => (
            <div key={p.crop} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 0',
              borderBottom: '0.5px solid var(--color-border-tertiary)',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.crop}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                  {p.unit} · {p.supplyLevel} supply
                  {p.volumeKg > 0 && ` · ~${p.volumeKg.toLocaleString()} kg`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {formatUGX(p.avgPrice)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                  {formatUGX(p.minPrice)}–{formatUGX(p.maxPrice)}
                </div>
              </div>
              {/* Logged tick */}
              <span style={{
                fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono,monospace)',
                background: '#EAF3DE', color: '#27500A',
                border: '0.5px solid #C0DD97', borderRadius: 4, padding: '2px 7px',
              }}>
                ✓ logged
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
