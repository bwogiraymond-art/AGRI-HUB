interface Tab {
  id: string;
  label: string;
  badge?: number;  // e.g. pending count on verification queue
}

interface NavTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor?: string;  // defaults to var(--role-color)
}

export default function NavTabs({
  tabs,
  activeTab,
  onTabChange,
  accentColor = 'var(--role-color)',
}: NavTabsProps) {
  return (
    <nav style={{
      background: 'var(--color-background-primary)',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
      padding: '0 20px',
      display: 'flex',
      gap: 0,
      overflowX: 'auto',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'inherit',
              color: isActive ? accentColor : 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span style={{
                background: '#E24B4A',
                color: '#fff',
                fontSize: 10,
                fontWeight: 500,
                padding: '1px 5px',
                borderRadius: 10,
                minWidth: 16,
                textAlign: 'center',
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
