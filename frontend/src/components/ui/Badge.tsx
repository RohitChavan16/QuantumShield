import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface-alt text-text-primary border border-border",
    critical: "bg-critical/10 text-critical border border-critical/20",
    high: "bg-high/10 text-high border border-high/20",
    medium: "bg-medium/10 text-medium border border-medium/20",
    low: "bg-low/10 text-low border border-low/20",
    info: "bg-info/10 text-info border border-info/20",
    outline: "text-text-primary border border-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-badge px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
