/**
 * HealthFit Design System - Color Palette
 * Base color: Green (#0df26c)
 * All colors are consistent with the neon green theme
 */

const tintColorLight = '#0df26c';
const tintColorDark = '#0df26c';

export const Colors = {
  light: {
    text: '#102217',
    background: '#f5f8f7',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    surface: '#ffffff',
    border: '#d1d5db',
    error: '#ef4444',
    success: '#0df26c',
    warning: '#f59e0b',
  },
  dark: {
    text: '#ECEDEE',
    background: '#102217',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    surface: '#1a2e22',
    surfaceLight: '#1c2e24',
    border: '#316848',
    error: '#ef4444',
    success: '#0df26c',
    warning: '#f59e0b',
  },
} as const;

export const PRIMARY = '#0df26c';
export const BACKGROUND_LIGHT = '#f5f8f7';
export const BACKGROUND_DARK = '#102217';
export const SURFACE_DARK = '#1a2e22';
export const SURFACE_LIGHT = '#ffffff';

export const GLOW_SHADOW = '0 0 20px rgba(13, 242, 108, 0.5)';
export const GLOW_SHADOW_STRONG = '0 0 30px rgba(13, 242, 108, 0.6)';
