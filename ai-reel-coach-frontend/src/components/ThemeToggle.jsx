import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ size = 'md' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: size === 'sm' ? 34 : 40,
        height: size === 'sm' ? 34 : 40,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--surface2)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'sm' ? 14 : 16,
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
