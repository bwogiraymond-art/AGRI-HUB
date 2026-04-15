import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export default function Modal({ isOpen, title, onClose, children, width = 480 }: ModalProps) {
  if (!isOpen) return null;

  return (
    /*
     * Normal-flow overlay — uses min-height instead of position:fixed
     * so the iframe auto-sizes correctly and content stays visible.
     */
    <div style={{
      position: 'relative',
      minHeight: 520,
      background: 'rgba(0,0,0,0.35)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    }}>
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 12,
        width: '100%',
        maxWidth: width,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              fontSize: 20, cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '0 4px', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
