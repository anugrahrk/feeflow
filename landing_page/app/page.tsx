import Navbar from '@/components/Navbar';
import CoinCanvas from '@/components/CoinCanvas';
import HeroSection from '@/components/sections/HeroSection';
import SystemActivation from '@/components/sections/SystemActivation';
import AutomationSection from '@/components/sections/AutomationSection';
import TrustSection from '@/components/sections/TrustSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
    return (
        <main className="relative bg-background-primary">
            {/* Fixed Navigation */}
            <Navbar />

            {/* Scroll-Linked Coin Canvas */}
            <CoinCanvas totalFrames={240} framePrefix="ezgif-frame-" />

            {/* Content Sections - Each section is ~100vh for ~400vh total scroll */}
            <div className="relative z-10">
                {/* Hero / Intro (0-15% scroll range) */}
                <HeroSection />

                {/* System Activation (15-40% scroll range) */}
                <SystemActivation />

                {/* Automation & Reminders (40-65% scroll range) */}
                <AutomationSection />

                {/* Trust, Security & Scale (65-85% scroll range) */}
                <TrustSection />

                {/* Flow State & CTA (85-100% scroll range) */}
                <CTASection />
            </div>
        </main>
    );
}
