import type { Variants } from "framer-motion";

export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const bookCardHover = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  hover: {
    scale: 1.05,
    y: -8,
    boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const progressBarAnimation = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 1, ease: "easeInOut" },
  }),
};

export const achievementUnlock: Variants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

export const notificationSlide: Variants = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "spring", damping: 20 } },
  exit: { x: 400, opacity: 0, transition: { duration: 0.2 } },
};

export const skeletonPulse = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const confettiAnimation = {
  initial: { y: -20, opacity: 1 },
  animate: {
    y: [0, 100],
    x: [-50, 50],
    opacity: [1, 0],
    rotate: [0, 360],
    transition: { duration: 2, ease: "easeOut" },
  },
};
