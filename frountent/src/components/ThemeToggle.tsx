import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

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
        {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
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
