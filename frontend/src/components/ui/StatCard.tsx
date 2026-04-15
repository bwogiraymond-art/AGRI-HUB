interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: 'green' | 'red' | 'amber' | 'default';
}

const SUB_COLORS = {
  green:   '#3B6D11',
  red:     '#A32D2D',
  amber:   '#854F0B',
  default: 'var(--color-text-secondary)',
};

export default function StatCard({ label, value, sub, subColor = 'default' }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 8,
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1, color: 'var(--color-text-primary)' }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: 11,
          marginTop: 4,
          color: SUB_COLORS[subColor],
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}
