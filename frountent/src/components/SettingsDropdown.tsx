import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Sun, Moon, LogOut } from 'lucide-react';

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { mode, color, toggleMode, setColor } = theme;
  const themeColors = theme.getThemeColors();
  const { logout } = useAuth();

  const colors: Array<{ name: string; value: 'blue' | 'purple' | 'red'; color: string }> = [
    { name: 'Blue', value: 'blue', color: '#0b7de0' },
    { name: 'Purple', value: 'purple', color: '#8b5cf6' },
    { name: 'Red', value: 'red', color: '#ef4444' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.settingsBtn,
          background: themeColors.surfaceHover,
          color: themeColors.text,
        }}
        title="Settings"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = mode === 'dark' 
            ? 'rgba(255,255,255,0.15)' 
            : 'rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = themeColors.surfaceHover;
        }}
      >
        <Settings size={18} />
      </button>

      {isOpen && (
        <>
          <div style={{
            ...styles.dropdown,
            background: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
            boxShadow: mode === 'dark' 
              ? '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' 
              : '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          }}>
            {/* Theme Mode */}
            <div style={styles.section}>
              <div style={{...styles.sectionLabel, color: themeColors.textSecondary}}>Theme Mode</div>
              <button
                onClick={toggleMode}
                style={{
                  ...styles.modeToggle,
                  background: themeColors.surfaceHover,
                  color: themeColors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = mode === 'dark' 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = themeColors.surfaceHover;
                }}
              >
                <span style={styles.modeIcon}>
                  {mode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                </span>
                <span style={styles.modeText}>{mode === 'dark' ? 'Dark' : 'Light'} Mode</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{...styles.divider, background: themeColors.border}} />

            {/* Accent Color */}
            <div style={styles.section}>
              <div style={{...styles.sectionLabel, color: themeColors.textSecondary}}>Accent Color</div>
              <div style={styles.colorGrid}>
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    style={{
                      ...styles.colorOption,
                      background: color === c.value ? themeColors.primaryLight : 'transparent',
                      color: themeColors.text,
                    }}
                    title={c.name}
                    onMouseEnter={(e) => {
                      if (color !== c.value) {
                        e.currentTarget.style.background = themeColors.surfaceHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (color !== c.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div
                      style={{
                        ...styles.colorCircle,
                        background: c.color,
                        outline: color === c.value ? `2px solid ${c.color}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                    <span style={styles.colorName}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{...styles.divider, background: themeColors.border}} />

            {/* Logout */}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              style={styles.logoutBtn}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
          
          <style>{`
            @keyframes dropdownSlideIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
  },
  settingsBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#2a2a2a',
    borderRadius: '16px',
    padding: '16px',
    minWidth: '260px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    zIndex: 1001,
    backdropFilter: 'blur(20px)',
    transform: 'translateY(0)',
    animation: 'dropdownSlideIn 200ms ease-out',
  },
  section: {
    padding: '8px 0',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    paddingLeft: '4px',
  },
  modeToggle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  modeIcon: {
    fontSize: '18px',
  },
  modeText: {
    flex: 1,
    textAlign: 'left',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '8px 0',
  },
  colorGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  colorOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  colorCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  colorName: {
    flex: 1,
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,68,68,0.1)',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
};
