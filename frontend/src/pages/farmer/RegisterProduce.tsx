import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { GradeButton, Toast } from '../../components/ui';
import type { QualityGrade } from '../../types/market.types';
import { genRef }   from '../../utils/genRef';
import { todayISO } from '../../utils/formatters';

const CROPS      = ['Maize','Beans','Tomatoes','Cassava','Sweet potato','Sorghum','Groundnuts','Onions','Cabbage','Bananas (matoke)','Millet'];
const DISTRICTS  = ['Wakiso','Mukono','Mpigi','Masaka','Jinja','Mbarara','Gulu','Lira','Soroti','Mbale'];
const TRANSPORTS = ['Boda boda','Pickup truck','Bus/taxi','Own vehicle','Other'];
const GRADES: QualityGrade[] = ['A','B','C','F'];

export default function RegisterProduce() {
  const { user }          = useAuth();
  const { toasts, show }  = useToast();

  const [crop,      setCrop]      = useState('');
  const [qty,       setQty]       = useState('');
  const [district,  setDistrict]  = useState('');
  const [village,   setVillage]   = useState('');
  const [grade,     setGrade]     = useState<QualityGrade | null>(null);
  const [price,     setPrice]     = useState('');
  const [transport, setTransport] = useState('');
  const [notes,     setNotes]     = useState('');
  const [date,      setDate]      = useState(todayISO());

  const handleSubmit = () => {
    if (!crop || !qty || !district || !grade) {
      show('Please fill in all required fields and select a quality grade.', 'warning');
      return;
    }
    const ref = genRef();
    show(`Produce registered — Ref: ${ref} · Pending verification`, 'success');
    // Reset
    setCrop(''); setQty(''); setDistrict(''); setVillage('');
    setGrade(null); setPrice(''); setTransport(''); setNotes('');
    setDate(todayISO());
  };

  const handleClear = () => {
    setCrop(''); setQty(''); setDistrict(''); setVillage('');
    setGrade(null); setPrice(''); setTransport(''); setNotes('');
    setDate(todayISO());
  };

  return (
    <div>
      {toasts.map(t => <Toast key={t.id} message={t.message} variant={t.variant} />)}

      <div className="card">
        <div className="card-head">
          <h3>Produce registration</h3>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            All fields required unless marked optional
          </span>
        </div>
        <div className="card-body">

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Farmer ID</label>
              <input type="text" value={user?.id ?? ''} readOnly
                style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date of arrival</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Crop / commodity type</label>
              <select value={crop} onChange={e => setCrop(e.target.value)}>
                <option value="">Select crop...</option>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Quantity (kg)</label>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)}
                placeholder="Enter weight in kilograms" min="1" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Source district</label>
              <select value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="">Select district...</option>
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Village / sub-county (optional)</label>
              <input type="text" value={village} onChange={e => setVillage(e.target.value)}
                placeholder="e.g. Kiteezi, Wakiso" />
            </div>
          </div>

          {/* Quality grade */}
          <div style={{ marginBottom: 12 }}>
            <div className="form-label" style={{ marginBottom: 6 }}>Self-assessed quality grade</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {GRADES.map(g => (
                <GradeButton key={g} grade={g} selected={grade === g} onClick={setGrade} />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Asking price (UGX per kg)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 1500" min="0" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Transport method</label>
              <select value={transport} onChange={e => setTransport(e.target.value)}>
                <option value="">Select...</option>
                {TRANSPORTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Harvested 3 days ago, stored in dry conditions..." />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>
              Submit registration →
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleClear}>
              Clear form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
