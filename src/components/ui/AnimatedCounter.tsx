import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const springValue = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(springValue, (current) =>
    `${prefix}${current.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    springValue.set(value);
  }, [springValue, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}
