import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LuxuryCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export const LuxuryCard = forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, children, variant = 'default', hover = true, glow = false }, ref) => {
    const variants = {
      default: 'bg-obsidian/80 border border-gold/10',
      elevated: 'bg-gradient-to-br from-obsidian via-graphite to-obsidian border border-gold/20 shadow-luxury',
      glass: 'bg-obsidian/40 backdrop-blur-xl border border-gold/10',
      bordered: 'bg-transparent border-2 border-gold/30',
    };

    const hoverStyles = hover
      ? 'hover:border-gold/40 hover:shadow-card-hover hover:-translate-y-1'
      : '';

    const glowStyles = glow
      ? 'shadow-gold animate-pulse-gold'
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg p-6 transition-all duration-500',
          variants[variant],
          hoverStyles,
          glowStyles,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }
);

LuxuryCard.displayName = 'LuxuryCard';
