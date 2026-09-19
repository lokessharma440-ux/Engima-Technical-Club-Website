import React, { useEffect, useRef } from 'react';
import { motion, animate, useInView, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

const CountUp = ({ to, suffix = "", duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (shouldReduceMotion) {
      count.set(to);
      return;
    }

    if (isInView) {
      const controls = animate(count, to, { duration: duration });
      return controls.stop;
    }
  }, [isInView, shouldReduceMotion, to, duration, count]);

  if (shouldReduceMotion) {
    return <span>{to}{suffix}</span>;
  }

  return (
    <span ref={ref} className="inline-flex">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export default CountUp;
