import { useState } from 'react';
import { useAuth }   from '../../context/AuthContext';
import { useMarket } from '../../context/MarketContext';
import { usePrices } from '../../hooks/usePrices';
import { useToast }  from '../../hooks/useToast';
import { StatCard, PriceRow, Toast } from '../../components/ui';
import { genRef }    from '../../utils/genRef';

const CROPS    = ['Maize','Beans','Tomatoes','Cassava','Sweet potato','Sorghum','Groundnuts','Onions','Cabbage'];
const DISTRICTS= ['Wakiso','Mukono','Mpigi','Masaka','Jinja','Mbarara','Gulu','Lira'];
const DOT_COLORS = ['#639922','#3B6D11','#D85A30','#BA7517','#185FA5','#5F5E5A'];

interface FarmerOverviewProps {
  onNavigate: (tab: string) => void;
}

export default function FarmerOverview({ onNavigate }: FarmerOverviewProps) {
  useAuth();
  const { summary } = useMarket();
  const { prices, trends } = usePrices();
  const { toasts, show }   = useToast();

  const [qCrop,     setQCrop]     = useState('');
  const [qQty,      setQQty]      = useState('');
  const [qDistrict, setQDistrict] = useState('');

  const handleQuickRegister = () => {
    if (!qCrop || !qQty || !qDistrict) {
      show('Please fill in all fields before registering.', 'warning');
      return;
    }
    const ref = genRef();
    show(`Produce registered — Ref: ${ref}`, 'success');
    setQCrop(''); setQQty(''); setQDistrict('');
  };

  const topPrices = prices.slice(0, 5);

  return (
    <div>
      {/* Toasts */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} variant={t.variant} />
      ))}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
        <StatCard label="Total produce registered" value="14"            sub="↑ 2 this week"      subColor="green" />
        <StatCard label="Estimated earnings"        value="UGX 842K"      sub="↑ 12% vs last month" subColor="green" />
        <StatCard label="Pending verification"      value={summary.pendingVerifications} sub="Awaiting official" />
        <StatCard label="Price fairness score"      value="87%"           sub="Above market avg"   subColor="green" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

        {/* Quick register */}
        <div className="card">
          <div className="card-head">
            <h3>Quick register produce</h3>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Shortcut</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Crop type</label>
              <select value={qCrop} onChange={e => setQCrop(e.target.value)}>
                <option value="">Select crop...</option>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Quantity (kg)</label>
                <input type="number" value={qQty} onChange={e => setQQty(e.target.value)} placeholder="e.g. 200" min="1" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Source district</label>
                <select value={qDistrict} onChange={e => setQDistrict(e.target.value)}>
                  <option value="">District...</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={handleQuickRegister}>
              Register now →
            </button>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => onNavigate('register')}
            >
              Full registration form ↗
            </button>
          </div>
        </div>

        {/* Today's top prices */}
        <div className="card">
          <div className="card-head">
            <h3>Today's top prices</h3>
            <span
              style={{ fontSize: 11, color: 'var(--role-color)', cursor: 'pointer' }}
              onClick={() => onNavigate('prices')}
            >
              View all →
            </span>
          </div>
          <div style={{ padding: '8px 18px 14px' }}>
            {topPrices.map((p, i) => (
              <PriceRow
                key={p.crop}
                price={p}
                trend={trends.find(t => t.crop === p.crop)}
                dotColor={DOT_COLORS[i % DOT_COLORS.length]}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
