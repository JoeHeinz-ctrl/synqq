import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { mode, color, toggleMode, setColor } = useTheme();

  const colors: Array<{ name: string; value: 'blue' | 'purple' | 'red'; color: string }> = [
    { name: 'Blue', value: 'blue', color: '#0b7de0' },
    { name: 'Purple', value: 'purple', color: '#8b5cf6' },
    { name: 'Red', value: 'red', color: '#ef4444' },
  ];

  return (
    <div style={styles.container}>
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        style={styles.modeBtn}
        title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {mode === 'dark' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>

      {/* Color Options */}
      <div style={styles.colorPicker}>
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => setColor(c.value)}
            style={{
              ...styles.colorBtn,
              background: c.color,
              outline: color === c.value ? `2px solid ${c.color}` : 'none',
              outlineOffset: '2px',
            }}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  modeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  colorPicker: {
    display: 'flex',
    gap: '6px',
    padding: '4px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
  },
  colorBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
