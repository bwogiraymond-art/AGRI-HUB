import { useAuth }  from '../../context/AuthContext';
import { StatusPill } from '../../components/ui';
import { formatUGX, formatDate } from '../../utils/formatters';
import type { ProduceStatus } from '../../types/market.types';

// Seed data — in production this comes from an API filtered by farmerId
const HISTORY: {
  ref: string; crop: string; grade: string;
  qty: number; date: string; earnings: number; status: ProduceStatus;
}[] = [
  { ref:'NKS-KM82-7741', crop:'Beans',       grade:'A', qty:150, date:'2026-04-10', earnings:525000, status:'sold'     },
  { ref:'NKS-AB31-2290', crop:'Maize',        grade:'B', qty:300, date:'2026-04-08', earnings:330000, status:'sold'     },
  { ref:'NKS-XR55-8831', crop:'Tomatoes',     grade:'A', qty:80,  date:'2026-04-05', earnings:224000, status:'pending'  },
  { ref:'NKS-QT20-4412', crop:'Cassava',      grade:'B', qty:200, date:'2026-04-02', earnings:160000, status:'verified' },
  { ref:'NKS-PL66-9923', crop:'Groundnuts',   grade:'A', qty:50,  date:'2026-03-28', earnings:275000, status:'sold'     },
];

const GRADE_STYLES: Record<string, { bg: string; color: string }> = {
  A: { bg:'#EAF3DE', color:'#27500A' },
  B: { bg:'#E6F1FB', color:'#0C447C' },
  C: { bg:'#FAEEDA', color:'#633806' },
};

export default function FarmerHistory() {
  const { user } = useAuth();

  return (
    <div className="card">
      <div className="card-head">
        <h3>My submission history</h3>
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          Farmer {user?.id}
        </span>
      </div>

      <div style={{ padding: '8px 18px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HISTORY.map(h => (
          <div
            key={h.ref}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              background: 'var(--color-background-secondary)',
              borderRadius: 8,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: '#EAF3DE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="5" width="12" height="9" rx="2" stroke="#3B6D11" strokeWidth="1.1"/>
                <path d="M5 5V4C5 2.9 6.3 2 8 2C9.7 2 11 2.9 11 4V5" stroke="#3B6D11" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {h.crop}
                <span style={{
                  fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 4,
                  background: GRADE_STYLES[h.grade]?.bg ?? '#F1EFE8',
                  color: GRADE_STYLES[h.grade]?.color ?? '#444',
                }}>
                  Grade {h.grade}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                {h.qty} kg · Submitted {formatDate(h.date)}
              </div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono,monospace)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {h.ref}
              </div>
            </div>

            {/* Right */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {formatUGX(h.earnings)}
              </div>
              <div style={{ marginTop: 4 }}>
                <StatusPill status={h.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
