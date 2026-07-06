"use client";

import type { MotionValue } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useRef } from "react";

type MotionNumber = number | MotionValue<number>;

type HeroMotionStyle = CSSProperties & {
  "--hero-accent-y"?: MotionNumber;
  "--hero-field-x"?: MotionNumber;
  "--hero-field-y"?: MotionNumber;
  "--hero-terminal-opacity"?: MotionNumber;
  "--hero-terminal-y"?: MotionNumber;
  "--hero-title-y"?: MotionNumber;
};

type HeroMotionSectionProps = {
  children: ReactNode;
};

export function HeroMotionSection({ children }: HeroMotionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const fieldX = useSpring(pointerX, { damping: 34, mass: 0.35, stiffness: 86 });
  const fieldY = useSpring(pointerY, { damping: 34, mass: 0.35, stiffness: 86 });
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: sectionRef
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const accentY = useTransform(scrollYProgress, [0, 1], [0, -58]);
  const terminalY = useTransform(scrollYProgress, [0, 0.7], [18, 0]);
  const terminalOpacity = useTransform(scrollYProgress, [0, 0.38], [0.78, 1]);

  return (
    <motion.section
      aria-labelledby="hero-title"
      className="hero editorialHero"
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      onPointerMove={(event) => {
        if (reduceMotion) {
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      ref={sectionRef}
      style={
        {
          "--hero-accent-y": reduceMotion ? 0 : accentY,
          "--hero-field-x": reduceMotion ? 0 : fieldX,
          "--hero-field-y": reduceMotion ? 0 : fieldY,
          "--hero-terminal-opacity": reduceMotion ? 1 : terminalOpacity,
          "--hero-terminal-y": reduceMotion ? 0 : terminalY,
          "--hero-title-y": reduceMotion ? 0 : titleY
        } as HeroMotionStyle
      }
    >
      {children}
    </motion.section>
  );
}
