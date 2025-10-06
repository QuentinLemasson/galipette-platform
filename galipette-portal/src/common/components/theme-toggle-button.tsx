/**
 * @fileOverview Simple theme toggle button for light/dark mode.
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { Button } from '../ui/button';

/**
 * Simple toggle button that switches between light and dark themes.
 * Follows system preference when no explicit choice is made.
 *
 * @returns Theme toggle button component
 */
export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    // Toggle between light and dark, never set to system explicitly
    // If currently system, switch to the opposite of current resolved theme
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
