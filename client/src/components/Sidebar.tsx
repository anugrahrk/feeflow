import { type Dispatch, type SetStateAction } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from "@clerk/clerk-react";

interface SidebarProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";
    };

    return (
        <>
            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                flex w-64 flex-col border-r border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#1a2230] h-full shrink-0
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center bg-primary rounded-lg size-10 shrink-0">
                        <span className="material-symbols-outlined text-white text-[24px]">payments</span>
                    </div>
                    <Link to="/" className="text-lg font-bold text-[#111318] dark:text-white leading-tight">Fee Admin</Link>
                </div>
                <div className="flex flex-col flex-1 gap-2 p-4 overflow-y-auto">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive("/")}`}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <p className="text-sm font-medium leading-normal">Dashboard</p>
                    </Link>
                    <Link
                        to="/s"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive("/s")}`}
                    >
                        <span className="material-symbols-outlined">school</span>
                        <p className="text-sm font-medium leading-normal">Students</p>
                    </Link>
                    {/* <Link
                        to="#"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive("/transactions")}`}
                    >
                        <span className="material-symbols-outlined">analytics</span>
                        <p className="text-sm font-medium leading-normal">Transactions</p>
                    </Link> */}
                </div>
                <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                        <UserButton
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    userButtonTrigger: "w-full flex justify-start p-1",
                                    userButtonBox: "flex-row-reverse w-full justify-between",
                                    userButtonOuterIdentifier: "text-sm font-medium text-[#111318] dark:text-white",
                                }
                            }}
                            showName={true}
                        />
                    </div>
                </div>
            </aside>
        </>
    )
}
