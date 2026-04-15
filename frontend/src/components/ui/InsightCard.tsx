type InsightVariant = 'warn' | 'info' | 'ok';

interface InsightCardProps {
  variant: InsightVariant;
  title: string;
  body: string;
}

const VARIANT_STYLES: Record<InsightVariant, {
  bg: string; border: string;
  titleColor: string; bodyColor: string; iconBg: string; icon: string;
}> = {
  warn: {
    bg: '#FAEEDA', border: '#FAC775',
    titleColor: '#633806', bodyColor: '#854F0B',
    iconBg: '#EF9F27', icon: '!',
  },
  info: {
    bg: '#E6F1FB', border: '#B5D4F4',
    titleColor: '#0C447C', bodyColor: '#185FA5',
    iconBg: '#185FA5', icon: 'i',
  },
  ok: {
    bg: '#EAF3DE', border: '#C0DD97',
    titleColor: '#27500A', bodyColor: '#3B6D11',
    iconBg: '#3B6D11', icon: '↑',
  },
};

export default function InsightCard({ variant, title, body }: InsightCardProps) {
  const s = VARIANT_STYLES[variant];
  return (
    <div style={{
      background: s.bg,
      border: `0.5px solid ${s.border}`,
      borderRadius: 8,
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        width: 28, height: 28,
        background: s.iconBg,
        borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 14, fontWeight: 700,
        flexShrink: 0,
      }}>
        {s.icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: s.titleColor, marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: s.bodyColor, lineHeight: 1.5 }}>
          {body}
        </div>
      </div>
    </div>
  );
}
