import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth.types';

// ─── Role config ──────────────────────────────────────────────────────────
const ROLES: {
  id: Role;
  label: string;
  sub: string;
  icon: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  hint: string;
  placeholder: string;
  route: string;
}[] = [
  {
    id: 'farmer',
    label: 'Farmer', sub: 'Produce seller',
    icon: '🌾',
    activeBg: '#EAF3DE', activeBorder: '#3B6D11', activeText: '#27500A',
    hint: 'Enter your NKS Farmer ID (e.g. NKS-F-00142)',
    placeholder: 'NKS-F-#####',
    route: '/farmer',
  },
  {
    id: 'trader',
    label: 'Trader', sub: 'Buyer / vendor',
    icon: '🛒',
    activeBg: '#E1F5EE', activeBorder: '#0F6E56', activeText: '#085041',
    hint: 'Enter your Trader License Number',
    placeholder: 'TRD-#####',
    route: '/trader',
  },
  {
    id: 'official',
    label: 'Official', sub: 'Market authority',
    icon: '📋',
    activeBg: '#E6F1FB', activeBorder: '#185FA5', activeText: '#0C447C',
    hint: 'Enter your KCCA Staff ID (e.g. KCCA-OFF-019)',
    placeholder: 'KCCA-OFF-###',
    route: '/official',
  },
  {
    id: 'admin',
    label: 'Admin', sub: 'KCCA / MAAIF',
    icon: '⚙️',
    activeBg: '#FAEEDA', activeBorder: '#854F0B', activeText: '#633806',
    hint: 'Enter your MAAIF / KCCA Admin ID (e.g. KCCA-ADM-003)',
    placeholder: 'KCCA-ADM-###',
    route: '/admin',
  },
];

const ROLE_ACCESS: Record<Role, string[]> = {
  farmer:   ['Register produce on arrival', 'View live market prices', 'Track your transaction history', 'Compare historical price data'],
  trader:   ['Log purchases and sales', 'Browse available produce', 'View price trends by commodity', 'Generate transaction receipts'],
  official: ['Verify & approve produce quality', 'Log daily commodity prices', 'Record market transactions', 'Generate daily market reports'],
  admin:    ['Full analytics dashboard', 'Manage users & roles', 'Export policy data reports', 'Monitor all market activity'],
};

const ACCESS_COLORS: Record<Role, { bg: string; text: string; bullet: string }> = {
  farmer:   { bg: '#EAF3DE', text: '#3B6D11', bullet: '#3B6D11' },
  trader:   { bg: '#E1F5EE', text: '#0F6E56', bullet: '#0F6E56' },
  official: { bg: '#E6F1FB', text: '#185FA5', bullet: '#185FA5' },
  admin:    { bg: '#FAEEDA', text: '#854F0B', bullet: '#854F0B' },
};

// ─── Component ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [userId, setUserId]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const activeRoleCfg = ROLES.find(r => r.id === selectedRole) ?? null;

  const handleLogin = async () => {
    setError('');
    if (!selectedRole) { setError('Please select a role to continue.'); return; }
    if (!userId.trim()) { setError('Please enter your ID.'); return; }
    if (!password)      { setError('Please enter your password.'); return; }

    const ok = await login({ userId: userId.trim(), password, role: selectedRole });
    if (ok) {
      navigate(activeRoleCfg!.route, { replace: true });
    } else {
      setError('Invalid credentials or role mismatch. Check your ID and selected role.');
    }
  };

  const today = new Date().toLocaleDateString('en-UG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--color-background-tertiary)' }}>

      {/* Gov banner */}
      <div style={{
        background: '#27500A', color: '#EAF3DE',
        fontSize: 11, padding: '6px 24px',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em',
      }}>
        <div style={{ width: 7, height: 7, background: '#C0DD97', borderRadius: '50%', flexShrink: 0 }} />
        Official Digital Platform — Republic of Uganda | Ministry of Agriculture, Animal Industry and Fisheries
      </div>

      {/* Header */}
      <header style={{
        background: 'var(--color-background-primary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 38, height: 38, background: '#3B6D11',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C10 2 4 6 4 11C4 14.3 6.7 17 10 17C13.3 17 16 14.3 16 11C16 6 10 2 10 2Z" fill="white" opacity="0.9"/>
            <path d="M10 7V17M7 10L10 7L13 10" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            E-Governance AgriHub
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: 1 }}>
            Nakasero Market Digital Governance System — Kampala, Uganda
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono,monospace)', color: '#3B6D11', background: '#EAF3DE', border: '0.5px solid #C0DD97', borderRadius: 4, padding: '3px 8px' }}>
          v1.0 PROTOTYPE
        </div>
      </header>

      {/* Main */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '40px 16px', gap: 40,
      }}>

        {/* Login panel */}
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 12, width: '100%', maxWidth: 420, overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{ padding: '24px 28px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4, color: 'var(--color-text-primary)' }}>
              Sign in to AgriHub
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Select your role and enter your credentials to continue
            </p>
          </div>

          {/* Panel body */}
          <div style={{ padding: '24px 28px' }}>

            {/* Role grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
              {ROLES.map(role => {
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => { setSelectedRole(role.id); setError(''); setUserId(''); }}
                    style={{
                      border: `0.5px solid ${isActive ? role.activeBorder : 'var(--color-border-secondary)'}`,
                      borderRadius: 8, padding: '12px 10px',
                      cursor: 'pointer', textAlign: 'center',
                      background: isActive ? role.activeBg : 'var(--color-background-primary)',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isActive ? role.activeBorder + '22' : 'var(--color-background-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 7px', fontSize: 16,
                    }}>
                      {role.icon}
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: isActive ? role.activeText : 'var(--color-text-secondary)',
                    }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {role.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ID field */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Market ID / Phone Number
              </label>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder={activeRoleCfg?.placeholder ?? 'e.g. NKS-F-00142'}
                style={{ width: '100%', fontSize: 13, padding: '7px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
              <div style={{ fontSize: 11, color: error ? '#A32D2D' : 'var(--color-text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono,monospace)' }}>
                {error || (activeRoleCfg?.hint ?? 'Enter your registered Market ID')}
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', fontSize: 13, padding: '7px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              style={{
                width: '100%', padding: '10px', borderRadius: 6,
                background: activeRoleCfg ? activeRoleCfg.activeBorder : '#3B6D11',
                color: '#fff', border: 'none', fontSize: 13, fontWeight: 500,
                fontFamily: 'inherit', cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1, transition: 'all 0.15s',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#3B6D11', marginTop: 12, cursor: 'pointer' }}>
              Forgot your credentials? Contact market office
            </p>
          </div>

          {/* Panel footer */}
          <div style={{
            padding: '12px 28px',
            background: 'var(--color-background-secondary)',
            borderTop: '0.5px solid var(--color-border-tertiary)',
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: 'var(--color-text-secondary)',
          }}>
            <div style={{ width: 6, height: 6, background: '#3B6D11', borderRadius: '50%', flexShrink: 0 }} />
            256-bit encrypted · Session expires after 8 hours · KCCA Authorised System
          </div>
        </div>

        {/* Access info panel */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROLES.map(role => {
            const ac = ACCESS_COLORS[role.id];
            return (
              <div key={role.id} style={{
                borderRadius: 8, padding: '14px 16px',
                background: ac.bg,
                border: `0.5px solid ${ac.bullet}22`,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.05em', color: ac.text, marginBottom: 8,
                }}>
                  {role.label} access
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {ROLE_ACCESS[role.id].map(item => (
                    <li key={item} style={{ fontSize: 12, color: ac.text, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0, marginTop: 1 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
