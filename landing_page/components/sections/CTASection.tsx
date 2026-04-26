'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInVariants } from '@/lib/scroll-utils';
import Link from 'next/link';

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center px-6 py-20"
            id="pricing"
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeInVariants}
                className="text-center max-w-4xl mx-auto z-10"
            >
                {/* Main Headline */}
                <h2 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
                    Pay once. <span className="text-gradient">Relax</span> all month.
                </h2>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed">
                    A smarter way to manage fees—without the mental load.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <Link href={'http://localhost:5173/login'}><motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 80, 255, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        className="gradient-border"
                    >
                        <div className="gradient-border-inner text-base font-semibold text-white px-8 py-3">
                            Start Paying Fees
                        </div>
                    </motion.button>
                    </Link>

                    <Link href={"#how-it-works"}><motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 rounded-xl border border-white/20 text-base font-medium text-white hover:border-white/40 transition-colors"
                    >
                        See How It Works
                    </motion.button>
                    </Link>
                </div>

                {/* Micro-copy */}
                <p className="text-sm text-text-tertiary max-w-2xl mx-auto">
                    Works for students, parents, institutions, and organizations.
                </p>

                {/* Trust Badges (Optional) */}
                <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
                    <TrustBadge>Bank-Grade Security</TrustBadge>
                    <TrustBadge>Instant Setup</TrustBadge>
                    <TrustBadge>24/7 Support</TrustBadge>
                </div>
            </motion.div>
        </section>
    );
}

function TrustBadge({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {children}
            </p>
        </div>
    );
}
