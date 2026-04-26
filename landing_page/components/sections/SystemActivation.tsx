'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { slideInLeftVariants } from '@/lib/scroll-utils';

export default function SystemActivation() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center px-6 py-20"
            id="how-it-works"
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={slideInLeftVariants}
                className="max-w-3xl z-10"
            >
                {/* Headline */}
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                    Built for everyday <span className="text-gradient">payments</span>.
                </h2>

                {/* Feature Points */}
                <div className="space-y-6">
                    <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                        Pay tuition fees, memberships, subscriptions, and institutional charges from one secure platform.
                    </p>

                    <div className="space-y-4">
                        <FeaturePoint>
                            No queues. No confusion. No missed deadlines.
                        </FeaturePoint>
                        <FeaturePoint>
                            From local tuition centers to large organizations—all in one place.
                        </FeaturePoint>
                        <FeaturePoint>
                            Simple, transparent, and designed for real-world fee management.
                        </FeaturePoint>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

function FeaturePoint({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0"></div>
            <p className="text-base md:text-lg text-text-secondary">
                {children}
            </p>
        </div>
    );
}
