import { GlobalTheme } from '../types/builder';

export interface ThemePreset {
  id: 'obsidian' | 'swiss' | 'editorial' | 'emerald' | 'nordic';
  name: string;
  tagline: string;
  category: 'Modern Dark' | 'Clean Light' | 'Editorial' | 'Dev Dark';
  theme: GlobalTheme;
  swatches: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Carbon',
    tagline: 'Linear / Vercel style. Pure dark carbon with subtle zinc borders and porcelain contrast.',
    category: 'Modern Dark',
    swatches: ['#09090b', '#18181b', '#27272a', '#fafafa', '#f4f4f5'],
    theme: {
      presetId: 'obsidian',
      primaryColor: '#f4f4f5',
      secondaryColor: '#a1a1aa',
      backgroundColor: '#09090b',
      surfaceColor: '#18181b',
      borderColor: '#27272a',
      textColor: '#fafafa',
      mutedTextColor: '#a1a1aa',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
      borderRadius: '8px',
    },
  },
  {
    id: 'swiss',
    name: 'Swiss Minimal',
    tagline: 'Dieter Rams / Stripe style. Crisp architectural white with pitch slate typography.',
    category: 'Clean Light',
    swatches: ['#ffffff', '#f8fafc', '#e2e8f0', '#0f172a', '#2563eb'],
    theme: {
      presetId: 'swiss',
      primaryColor: '#0f172a',
      secondaryColor: '#2563eb',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      borderColor: '#e2e8f0',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Plus Jakarta Sans, sans-serif',
      borderRadius: '6px',
    },
  },
  {
    id: 'editorial',
    name: 'Warm Editorial',
    tagline: 'Aesop / Kinfolk style. Warm limestone travertine, espresso text, and aged brass.',
    category: 'Editorial',
    swatches: ['#faf8f5', '#f4ede4', '#e5dcd3', '#292524', '#b45309'],
    theme: {
      presetId: 'editorial',
      primaryColor: '#b45309',
      secondaryColor: '#c2410c',
      backgroundColor: '#faf8f5',
      surfaceColor: '#f4ede4',
      borderColor: '#e5dcd3',
      textColor: '#292524',
      mutedTextColor: '#78716c',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      headingFont: 'Georgia, serif',
      borderRadius: '4px',
    },
  },
  {
    id: 'emerald',
    name: 'Supabase Emerald',
    tagline: 'Deep pine obsidian with muted jade borders and high-energy emerald mint accents.',
    category: 'Dev Dark',
    swatches: ['#050e0a', '#0b241b', '#14532d', '#f0fdf4', '#10b981'],
    theme: {
      presetId: 'emerald',
      primaryColor: '#10b981',
      secondaryColor: '#34d399',
      backgroundColor: '#050e0a',
      surfaceColor: '#0b241b',
      borderColor: '#14532d',
      textColor: '#f0fdf4',
      mutedTextColor: '#86efac',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Outfit, sans-serif',
      borderRadius: '10px',
    },
  },
  {
    id: 'nordic',
    name: 'Nordic Arctic',
    tagline: 'Raycast / Arc style. Midnight oceanic slate with precision glacier cyan highlights.',
    category: 'Modern Dark',
    swatches: ['#080d1a', '#0e172a', '#1e293b', '#f8fafc', '#06b6d4'],
    theme: {
      presetId: 'nordic',
      primaryColor: '#06b6d4',
      secondaryColor: '#38bdf8',
      backgroundColor: '#080d1a',
      surfaceColor: '#0e172a',
      borderColor: '#1e293b',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Plus Jakarta Sans, sans-serif',
      borderRadius: '8px',
    },
  },
];
