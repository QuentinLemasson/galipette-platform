/**
 * @fileOverview Preferences dropdown component with settings.
 */

import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

/**
 * Preferences dropdown component containing application settings.
 *
 * @returns Preferences dropdown component
 */
export function PreferencesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Preferences</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="text-sm">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
