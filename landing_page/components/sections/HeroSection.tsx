'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInVariants } from '@/lib/scroll-utils';

export default function HeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center px-6"
            id="overview"
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "exit"}
                variants={fadeInVariants}
                className="text-center max-w-4xl mx-auto z-10"
            >
                {/* Main Headline */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                    Fees, without <span className="text-gradient">friction</span>.
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-text-secondary mb-4 leading-relaxed">
                    One platform to pay every fee—securely, automatically, on time.
                </p>

                {/* Supporting Line */}
                <p className="text-base md:text-lg text-text-tertiary max-w-2xl mx-auto">
                    Tuition centers, institutes, organizations, and authorities—unified.
                </p>
            </motion.div>
        </section>
    );
}
