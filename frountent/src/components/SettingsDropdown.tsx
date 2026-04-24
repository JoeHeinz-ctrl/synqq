import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"></path>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          ...styles.dropdown,
          background: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
          boxShadow: mode === 'dark' 
            ? '0 8px 24px rgba(0,0,0,0.4)' 
            : '0 8px 24px rgba(0,0,0,0.15)',
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
                {mode === 'dark' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
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
    borderRadius: '12px',
    padding: '12px',
    minWidth: '220px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    zIndex: 1000,
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
