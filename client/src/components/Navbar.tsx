import { useState, type Dispatch, type SetStateAction } from 'react';

interface NavbarProps {
    setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setIsMobileMenuOpen }: NavbarProps) {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const mockNotifications = [
        { id: 1, student: "Alice Johnson", amount: "$500", time: "2 mins ago" },
        { id: 2, student: "Bob Smith", amount: "$1200", time: "1 hour ago" },
        { id: 3, student: "Charlie Brown", amount: "$300", time: "3 hours ago" },
        { id: 4, student: "David Wilson", amount: "$450", time: "5 hours ago" },
        { id: 5, student: "Eva Davis", amount: "$2200", time: "1 day ago" },
    ];

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#1a2230] px-4 md:px-8 py-4 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-1 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Admin Dashboard</h2>
            </div>
            <div className="flex items-center gap-6">
                <label className="hidden md:flex flex-col min-w-64 h-10">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input className="form-input block w-full rounded-lg border-none bg-slate-100 dark:bg-slate-800 dark:text-white pl-10 pr-3 py-2 text-sm placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search student or transaction ID..." value="" />
                    </div>
                </label>

                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors relative"
                    >
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2230]"></span>
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1a2230] rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 z-50 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-semibold text-[#111318] dark:text-white">Notifications</h3>
                                <button className="text-xs text-primary hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {mockNotifications.map((notification) => (
                                    <div key={notification.id} className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-medium text-[#111318] dark:text-white">Payment Received</p>
                                            <span className="text-xs text-slate-400">{notification.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            <span className="font-medium text-[#111318] dark:text-white">{notification.student}</span> paid <span className="text-green-600 font-medium">{notification.amount}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1a2230]">
                                <button className="text-sm text-primary font-medium hover:underline">See all notifications</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
