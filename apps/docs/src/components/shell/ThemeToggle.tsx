import { Moon, Sun } from 'lucide-react';
import { Button } from '@commonforge/ui';
import { useTheme } from '../../lib/theme.js';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      leftIcon={theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    />
  );
}
