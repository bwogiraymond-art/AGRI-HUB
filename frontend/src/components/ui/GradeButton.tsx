import type { QualityGrade } from '../../types/market.types';

interface GradeButtonProps {
  grade: QualityGrade;
  selected: boolean;
  onClick: (grade: QualityGrade) => void;
}

const GRADE_CONFIG: Record<QualityGrade, {
  label: string;
  sub: string;
  activeBg: string;
  activeColor: string;
  activeBorder: string;
}> = {
  A: { label: 'Grade A', sub: 'Excellent', activeBg: '#EAF3DE', activeColor: '#27500A', activeBorder: '#3B6D11' },
  B: { label: 'Grade B', sub: 'Good',      activeBg: '#E6F1FB', activeColor: '#0C447C', activeBorder: '#185FA5' },
  C: { label: 'Grade C', sub: 'Fair',      activeBg: '#FAEEDA', activeColor: '#633806', activeBorder: '#854F0B' },
  F: { label: 'Reject',  sub: 'Fail QC',   activeBg: '#FCEBEB', activeColor: '#791F1F', activeBorder: '#A32D2D' },
};

export default function GradeButton({ grade, selected, onClick }: GradeButtonProps) {
  const cfg = GRADE_CONFIG[grade];
  return (
    <button
      onClick={() => onClick(grade)}
      style={{
        padding: '8px 6px',
        textAlign: 'center',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        border: `0.5px solid ${selected ? cfg.activeBorder : 'var(--color-border-secondary)'}`,
        background: selected ? cfg.activeBg : 'var(--color-background-primary)',
        color: selected ? cfg.activeColor : 'var(--color-text-secondary)',
        transition: 'all 0.15s',
      }}
    >
      {cfg.label}
      <br />
      <span style={{ fontSize: 10, fontWeight: 400 }}>{cfg.sub}</span>
    </button>
  );
}
