'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { slideInRightVariants } from '@/lib/scroll-utils';

export default function AutomationSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-end px-6 py-20"
            id="automation"
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={slideInRightVariants}
                className="max-w-3xl z-10 text-right"
            >
                {/* Headline */}
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                    Never miss a <span className="text-gradient">due date</span> again.
                </h2>

                {/* Feature Points */}
                <div className="space-y-6">
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                        Stay on top of every payment with intelligent automation.
                    </p>

                    <div className="space-y-4">
                        <AutomationFeature>
                            Automated monthly reminders via WhatsApp
                        </AutomationFeature>
                        <AutomationFeature>
                            Clear payment status and history tracking
                        </AutomationFeature>
                        <AutomationFeature>
                            Designed for recurring, real-world fees
                        </AutomationFeature>
                        <AutomationFeature>
                            Set it once, relax all year
                        </AutomationFeature>
                    </div>

                    <p className="text-base text-text-tertiary mt-8 italic">
                        Relief. Reliability. Trust.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}

function AutomationFeature({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 justify-end">
            <p className="text-base md:text-lg text-text-secondary text-right">
                {children}
            </p>
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0"></div>
        </div>
    );
}
