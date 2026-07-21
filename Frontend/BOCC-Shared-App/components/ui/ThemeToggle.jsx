'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

// Light/dark toggle button, shared by every header (auth, dashboard,
// incubator). Reads/writes theme via ThemeProvider's useTheme().
//
// Renders an empty same-sized placeholder until `mounted` is true. This is
// required, not decorative: on the server we can't know the visitor's saved
// theme, so a same-render Sun/Moon guess would mismatch whatever the client
// applies from localStorage a moment later, which is exactly the kind of
// hydration error that broke this app's rendering once already.
export default function ThemeToggle({ size = 20, className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div style={{ width: size + 16, height: size + 16 }} />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-full text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors ${className}`}
    >
      {theme === 'dark' ? (
        <Sun size={size} strokeWidth={2} />
      ) : (
        <Moon size={size} strokeWidth={2} />
      )}
    </button>
  );
}
