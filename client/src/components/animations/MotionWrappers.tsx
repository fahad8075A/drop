"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function RevealFromLeft({
  children,
  delay = 0,
  duration = 0.65,
  className = "",
  once = false,
}: AnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealFromRight({
  children,
  delay = 0,
  duration = 0.65,
  className = "",
  once = false,
}: AnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealUp({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  once = false,
}: AnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.55,
  className = "",
  once = false,
}: AnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * TwoSidedSection:
 * For two-column split layouts.
 * If reversed is false (default): Left column reveals from Left, Right column reveals from Right.
 * If reversed is true: Left column reveals from Right, Right column reveals from Left (alternating design).
 * Runs every time it comes into view (once = false).
 */
export function TwoSidedSection({
  leftContent,
  rightContent,
  reversed = false,
  className = "",
  leftSpan = "lg:col-span-6",
  rightSpan = "lg:col-span-6",
  once = false,
}: {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  reversed?: boolean;
  className?: string;
  leftSpan?: string;
  rightSpan?: string;
  once?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${className}`}>
      <div className={leftSpan}>
        {reversed ? (
          <RevealFromRight once={once} delay={0.08}>{leftContent}</RevealFromRight>
        ) : (
          <RevealFromLeft once={once} delay={0.08}>{leftContent}</RevealFromLeft>
        )}
      </div>
      <div className={rightSpan}>
        {reversed ? (
          <RevealFromLeft once={once} delay={0.16}>{rightContent}</RevealFromLeft>
        ) : (
          <RevealFromRight once={once} delay={0.16}>{rightContent}</RevealFromRight>
        )}
      </div>
    </div>
  );
}

/**
 * TwoSidedColumn:
 * Animates a column with staggered items (badge, heading, body, actions).
 */
export function TwoSidedColumn({
  direction = "left",
  children,
  className = "",
  delay = 0,
  once = false,
}: {
  direction?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const initialX = shouldReduceMotion ? 0 : direction === "left" ? -45 : 45;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({
  children,
  className = "",
  staggerDelay = 0.1,
  once = false,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedCounter:
 * Counts up smoothly from 0 to target when entering viewport.
 * Resets on leave so it counts up every time the user scrolls back to it or refreshes.
 */
export function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1.8,
  once = false,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  once?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      setCount(0);
      return;
    }
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    frameId = window.requestAnimationFrame(step);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [hasStarted, target, duration]);

  return (
    <motion.span
      onViewportEnter={() => setHasStarted(true)}
      onViewportLeave={() => {
        if (!once) {
          setHasStarted(false);
          setCount(0);
        }
      }}
      viewport={{ once, amount: 0.3 }}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
