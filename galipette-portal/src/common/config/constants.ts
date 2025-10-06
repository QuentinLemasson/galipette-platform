/**
 * @fileOverview Shared configuration constants for the application.
 */

/**
 * Local storage keys used throughout the application.
 */
export const LOCAL_STORAGE_KEYS = {
  /** Key for storing user theme preference (light/dark/system) */
  THEME: 'galipette-theme',
} as const;

/**
 * Default values for application settings.
 */
export const DEFAULTS = {
  /** Default theme mode (follows system preference) */
  THEME: 'system',
} as const;
