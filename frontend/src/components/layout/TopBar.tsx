import type { Role } from '../../types/auth.types';

interface TopBarProps {
  role: Role;
  userId: string;
  userName: string;
}

const ROLE_CONFIG: Record<Role, {
  label: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  chipBg: string;
  chipColor: string;
}> = {
  farmer: {
    label: 'Farmer',
    badgeBg: '#EAF3DE', badgeColor: '#27500A', badgeBorder: '#C0DD97',
    chipBg: '#3B6D11',  chipColor: '#fff',
  },
  trader: {
    label: 'Trader',
    badgeBg: '#E1F5EE', badgeColor: '#085041', badgeBorder: '#9FE1CB',
    chipBg: '#0F6E56',  chipColor: '#fff',
  },
  official: {
    label: 'Market Official',
    badgeBg: '#E6F1FB', badgeColor: '#0C447C', badgeBorder: '#B5D4F4',
    chipBg: '#185FA5',  chipColor: '#fff',
  },
  admin: {
    label: 'Admin',
    badgeBg: '#FAEEDA', badgeColor: '#633806', badgeBorder: '#FAC775',
    chipBg: '#854F0B',  chipColor: '#fff',
  },
};

export default function TopBar({ role, userId, userName }: TopBarProps) {
  const cfg = ROLE_CONFIG[role];
  const today = new Date().toLocaleDateString('en-UG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <header style={{
      background: 'var(--color-background-primary)',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* Logo chip */}
      <div style={{
        width: 30, height: 30,
        background: cfg.chipBg,
        borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1C8 1 3 4.5 3 8.5C3 11.1 5.2 13 8 13C10.8 13 13 11.1 13 8.5C13 4.5 8 1 8 1Z"
            fill="white" opacity="0.9"
          />
          <path
            d="M8 5V13M5.5 7.5L8 5L10.5 7.5"
            stroke={cfg.chipBg} strokeWidth="1.1"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Title */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          E-Governance AgriHub
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1 }}>
          Nakasero Market · Kampala, Uganda
        </div>
      </div>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* User badge */}
        <div style={{
          background: cfg.badgeBg,
          color: cfg.badgeColor,
          border: `0.5px solid ${cfg.badgeBorder}`,
          fontSize: 11, fontWeight: 500,
          padding: '3px 9px', borderRadius: 4,
        }}>
          {cfg.label} · {userName || userId}
        </div>

        {/* Date chip */}
        <div style={{
          fontSize: 11,
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {today}
        </div>
      </div>
    </header>
  );
}
