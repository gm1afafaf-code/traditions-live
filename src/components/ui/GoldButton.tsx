import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface GoldButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider';

    const variants = {
      primary:
        'bg-gradient-to-r from-gold via-gold-muted to-gold text-void hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105',
      secondary:
        'bg-white/10 border border-gold/30 text-gold hover:bg-gold/10',
      outline:
        'border-2 border-gold text-gold hover:bg-gold hover:text-void',
      ghost: 'text-gold hover:bg-gold/10',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

GoldButton.displayName = 'GoldButton';
