import type { ToastVariant } from '../../hooks/useToast';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
}

const VARIANT_STYLES: Record<ToastVariant, {
  bg: string; border: string; color: string; iconBg: string;
}> = {
  success: { bg: '#EAF3DE', border: '#C0DD97', color: '#27500A', iconBg: '#3B6D11' },
  warning: { bg: '#FAEEDA', border: '#FAC775', color: '#633806', iconBg: '#854F0B' },
  error:   { bg: '#FCEBEB', border: '#F7C1C1', color: '#791F1F', iconBg: '#A32D2D' },
  info:    { bg: '#E6F1FB', border: '#B5D4F4', color: '#0C447C', iconBg: '#185FA5' },
};

const ICONS: Record<ToastVariant, string> = {
  success: '✓',
  warning: '!',
  error:   '✕',
  info:    'i',
};

export default function Toast({ message, variant = 'success', onDismiss }: ToastProps) {
  const s = VARIANT_STYLES[variant];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: s.bg,
      border: `0.5px solid ${s.border}`,
      borderRadius: 8,
      padding: '12px 16px',
      marginBottom: 16,
    }}>
      {/* Icon */}
      <div style={{
        width: 24, height: 24,
        background: s.iconBg,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        fontSize: 12, fontWeight: 700,
        flexShrink: 0,
      }}>
        {ICONS[variant]}
      </div>

      {/* Message */}
      <div style={{ flex: 1, fontSize: 13, color: s.color }}>
        {message}
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none', border: 'none',
            color: s.color, cursor: 'pointer',
            fontSize: 16, lineHeight: 1,
            padding: '0 2px', opacity: 0.6,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
