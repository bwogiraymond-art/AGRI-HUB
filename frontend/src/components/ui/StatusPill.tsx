import type { ProduceStatus, TransactionStatus } from '../../types/market.types';

type AnyStatus = ProduceStatus | TransactionStatus;

interface StatusPillProps {
  status: AnyStatus;
}

const STATUS_STYLES: Record<AnyStatus, { bg: string; color: string }> = {
  pending:   { bg: '#FAEEDA', color: '#633806' },
  verified:  { bg: '#EAF3DE', color: '#27500A' },
  flagged:   { bg: '#E6F1FB', color: '#0C447C' },
  rejected:  { bg: '#FCEBEB', color: '#791F1F' },
  sold:      { bg: '#E1F5EE', color: '#085041' },
  completed: { bg: '#EAF3DE', color: '#27500A' },
  disputed:  { bg: '#FCEBEB', color: '#791F1F' },
};

const STATUS_LABELS: Record<AnyStatus, string> = {
  pending:   'Pending',
  verified:  'Verified',
  flagged:   'Flagged',
  rejected:  'Rejected',
  sold:      'Sold',
  completed: 'Completed',
  disputed:  'Disputed',
};

export default function StatusPill({ status }: StatusPillProps) {
  const style = STATUS_STYLES[status] ?? { bg: '#F1EFE8', color: '#444441' };
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 11,
      fontWeight: 500,
      padding: '2px 8px',
      borderRadius: 4,
      background: style.bg,
      color: style.color,
    }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
