'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface LucideIconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export const availableIcons: string[] = [
  'ShieldCheck',
  'Layers',
  'Cpu',
  'Zap',
  'Globe2',
  'CheckCircle2',
  'ArrowRight',
  'Lock',
  'Star',
  'Sparkles',
  'Clock',
  'Code2',
  'BarChart3',
  'Database',
  'Users',
  'Smartphone',
  'Search',
  'Mail',
  'Folder',
  'Terminal',
  'TrendingUp',
  'ExternalLink',
  'Check',
  'Plus',
  'Layout',
  'FileText',
  'Boxes',
  'SlidersHorizontal',
];

export const LucideIcon: React.FC<LucideIconProps> = ({
  name,
  size = 20,
  color,
  className,
  strokeWidth = 2,
}) => {
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.HelpCircle;

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
};
