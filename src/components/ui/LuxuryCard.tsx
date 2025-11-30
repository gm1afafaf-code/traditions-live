import { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LuxuryCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: 'default' | 'glass' | 'elevated';
  glow?: boolean;
}

export const LuxuryCard = forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, variant = 'default', glow = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl transition-all duration-300';

    const variants = {
      default: 'bg-white/5 backdrop-blur-sm border border-gold/10',
      glass: 'bg-white/10 backdrop-blur-xl border border-gold/20',
      elevated: 'bg-gradient-to-br from-obsidian/90 to-void/80 backdrop-blur-xl border border-gold/30',
    };

    const glowStyles = glow
      ? 'shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.25)]'
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], glowStyles, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

LuxuryCard.displayName = 'LuxuryCard';
