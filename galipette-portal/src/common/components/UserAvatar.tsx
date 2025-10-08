/**
 * @fileOverview User avatar component with fallback to initials.
 * Built on shadcn Avatar component with automatic initial generation.
 */

import { cn } from '@/common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/ui';

export interface UserAvatarProps {
  /** User object with username and optional image */
  user: {
    username: string;
    email?: string;
    image?: string;
  };
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS class names */
  className?: string;
}

const sizeConfig = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const textSizeConfig = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

/**
 * User avatar with automatic initial generation from username.
 *
 * @example
 * ```tsx
 * <UserAvatar
 *   user={{ username: 'john_doe', email: 'john@example.com' }}
 *   size="md"
 * />
 * ```
 */
export const UserAvatar = ({
  user,
  size = 'md',
  className,
}: UserAvatarProps) => {
  const getInitials = (username: string): string => {
    return username
      .split(/[\s._-]/)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(user.username);
  const sizeClasses = sizeConfig[size];
  const textSizeClasses = textSizeConfig[size];

  return (
    <Avatar className={cn(sizeClasses, className)}>
      {user.image && <AvatarImage src={user.image} alt={user.username} />}
      <AvatarFallback
        className={cn(
          'bg-primary/10 text-primary font-medium',
          textSizeClasses
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
