import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden">
            <div className="flex h-screen w-full overflow-hidden relative">
                <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="flex flex-col flex-1 h-full overflow-hidden relative">
                    {!['/c', '/p'].includes(location.pathname) && <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />}
                    <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark relative">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
