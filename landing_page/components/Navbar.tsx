'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            style={{
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div
                    className="rounded-2xl px-6 py-13 flex items-center justify-between backdrop-blur-xl"
                >
                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            FeeFlow
                        </h1>
                    </div>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="#overview">Overview</NavLink>
                        <NavLink href="#how-it-works">How it Works</NavLink>
                        <NavLink href="#automation">Automation</NavLink>
                        <NavLink href="#security">Security</NavLink>
                        <NavLink href="#pricing">Pricing</NavLink>
                    </div>

                    {/* CTA Button */}
                    <Link href={'http://localhost:5173/login'}><motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="gradient-border hidden md:block"
                    >
                        <div className="gradient-border-inner font-medium text-sm text-white">
                            Start Paying Fees
                        </div>
                    </motion.button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.05 }}
            className="text-sm font-medium text-text-secondary hover:text-white transition-colors duration-200"
        >
            {children}
        </motion.a>
    );
}
