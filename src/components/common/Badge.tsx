import React from 'react';
import clsx from 'clsx';
import { AlertSeverity } from '../../types/alert';
import { SurvivorPriority, SurvivorStatus } from '../../types/survivor';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'warning' | 'watch' | 'success' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const variantStyles = {
    critical: 'bg-[#FF3B4E]/15 text-[#FF3B4E] border-[#FF3B4E]/30',
    warning: 'bg-[#FF9F1C]/15 text-[#FF9F1C] border-[#FF9F1C]/30',
    watch: 'bg-[#F6C945]/15 text-[#F6C945] border-[#F6C945]/30',
    success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
    info: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
    neutral: 'bg-white/5 text-[#94A3B8] border-white/10',
  };

  const dotStyles = {
    critical: 'bg-[#FF3B4E]',
    warning: 'bg-[#FF9F1C]',
    watch: 'bg-[#F6C945]',
    success: 'bg-[#22C55E]',
    info: 'bg-[#38BDF8]',
    neutral: 'bg-[#94A3B8]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-bold font-mono tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 font-mono font-medium',
    lg: 'text-sm px-3 py-1.5 font-mono font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-lg border shadow-xs',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotStyles[variant])} />}
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity; className?: string }> = ({
  severity,
  className,
}) => {
  const map: Record<AlertSeverity, { variant: BadgeProps['variant']; label: string }> = {
    CRITICAL: { variant: 'critical', label: 'CRITICAL' },
    WARNING: { variant: 'warning', label: 'WARNING' },
    WATCH: { variant: 'watch', label: 'WATCH' },
    MONITORING: { variant: 'info', label: 'MONITORING' },
  };

  const { variant, label } = map[severity] || { variant: 'neutral', label: severity };

  return (
    <Badge variant={variant} size="sm" dot className={className}>
      {label}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: SurvivorPriority; className?: string }> = ({
  priority,
  className,
}) => {
  const map: Record<SurvivorPriority, { variant: BadgeProps['variant']; label: string }> = {
    CRITICAL: { variant: 'critical', label: 'CRITICAL PRIORITY' },
    HIGH: { variant: 'warning', label: 'HIGH PRIORITY' },
    MEDIUM: { variant: 'watch', label: 'MEDIUM PRIORITY' },
    MONITOR: { variant: 'neutral', label: 'MONITOR' },
  };

  const { variant, label } = map[priority] || { variant: 'neutral', label: priority };

  return (
    <Badge variant={variant} size="sm" dot className={className}>
      {label}
    </Badge>
  );
};

export const SurvivorStatusBadge: React.FC<{ status: SurvivorStatus; className?: string }> = ({
  status,
  className,
}) => {
  const map: Record<SurvivorStatus, { variant: BadgeProps['variant']; label: string }> = {
    VERIFIED: { variant: 'success', label: 'AI VERIFIED' },
    PENDING_VERIFICATION: { variant: 'watch', label: 'VERIFICATION PENDING' },
    FALSE_DETECTION: { variant: 'neutral', label: 'FALSE POSITIVE' },
    RESCUE_DISPATCHED: { variant: 'critical', label: 'RESCUE DISPATCHED' },
    RESCUED: { variant: 'success', label: 'EVACUATED / SAFE' },
  };

  const { variant, label } = map[status] || { variant: 'neutral', label: status };

  return (
    <Badge variant={variant} size="sm" dot={status === 'RESCUE_DISPATCHED'} className={className}>
      {label}
    </Badge>
  );
};
