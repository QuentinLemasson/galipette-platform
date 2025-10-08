/**
 * @fileOverview User item component built on shadcn Item with user avatar and actions.
 * Provides a consistent way to display user information with optional actions.
 */

import { cn } from '@/common/utils';
import { Item } from '@/common/ui';
import { UserAvatar, StatusBadge } from '@/common/components';
import type { ReactNode } from 'react';

export interface UserItemProps {
  /** User information */
  user: {
    username: string;
    email?: string;
    image?: string;
  };
  /** User role for status badge */
  role?: string;
  /** Additional content to display on the right side */
  actions?: ReactNode;
  /** Whether the item is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * User item component with avatar, user info, and optional actions.
 *
 * @example
 * ```tsx
 * <UserItem
 *   user={{ username: 'john_doe', email: 'john@example.com' }}
 *   role="GM"
 *   actions={<Button>Remove</Button>}
 * />
 * ```
 */
export const UserItem = ({
  user,
  role,
  actions,
  clickable = false,
  onClick,
  className,
}: UserItemProps) => {
  return (
    <Item
      className={cn(
        'flex items-center justify-between p-3',
        clickable && 'cursor-pointer hover:bg-muted/50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <UserAvatar user={user} size="md" />
        <div>
          <div className="font-medium">{user.username}</div>
          {user.email && (
            <div className="text-sm text-muted-foreground">{user.email}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {role && (
          <StatusBadge variant={role === 'GM' ? 'info' : 'neutral'}>
            {role}
          </StatusBadge>
        )}
        {actions}
      </div>
    </Item>
  );
};
