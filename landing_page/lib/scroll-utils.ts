import { useScroll, useTransform, MotionValue } from 'framer-motion';

/**
 * Custom hook to track scroll progress from 0 to 1
 */
export function useScrollProgress() {
    const { scrollYProgress } = useScroll();
    return scrollYProgress;
}

/**
 * Maps a value from one range to another
 */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Custom easing functions
 */
export const easings = {
    easeOutQuart: (x: number): number => 1 - Math.pow(1 - x, 4),
    easeInOutQuart: (x: number): number =>
        x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
    easeOutExpo: (x: number): number =>
        x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
};

/**
 * Common Framer Motion animation variants
 */
export const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
    exit: {
        opacity: 0,
        y: -30,
        transition: { duration: 0.5, ease: 'easeIn' },
    },
};

export const slideInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

export const slideInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

export const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
