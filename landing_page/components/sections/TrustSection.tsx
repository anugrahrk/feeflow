'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { scaleInVariants } from '@/lib/scroll-utils';

export default function TrustSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center px-6 py-20"
            id="security"
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={scaleInVariants}
                className="max-w-4xl mx-auto z-10"
            >
                {/* Headline */}
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                    Secure by <span className="text-gradient">design</span>.
                </h2>

                {/* Security Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <SecurityFeature
                        title="Enterprise-Grade Security"
                        description="Bank-level encryption and security protocols protect every transaction."
                    />
                    <SecurityFeature
                        title="Encrypted Transactions"
                        description="End-to-end encryption ensures your financial data stays private."
                    />
                    <SecurityFeature
                        title="Transparent Records"
                        description="Complete audit trails and transaction history at your fingertips."
                    />
                    <SecurityFeature
                        title="Built to Scale"
                        description="From local institutes to large authorities—trusted infrastructure."
                    />
                </div>

                {/* Supporting Text */}
                <p className="text-lg text-text-secondary text-center max-w-2xl mx-auto">
                    Compliance-ready. Government-approved. Built for institutions that demand the highest standards.
                </p>
            </motion.div>
        </section>
    );
}

function SecurityFeature({ title, description }: { title: string; description: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl border border-white/10 bg-background-secondary/50"
        >
            <h3 className="text-xl font-semibold mb-3 text-white">
                {title}
            </h3>
            <p className="text-base text-text-secondary leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
