export default function Payment() {
    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#111318] dark:text-white">
                    My Payments
                </h1>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Balance Due</p>
                    <p className="text-2xl font-bold text-red-500">$2,450.00</p>
                </div>
            </div>

            {/* Pending Payments Alert Section */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-red-500">warning</span>
                    <h2 className="text-lg font-bold text-white">Pending Payments</h2>
                    <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium ml-auto border border-red-500/20">Action Required</span>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Payment Card 1 */}
                    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-lg">
                        <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-blue-500">school</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-semibold text-lg">Tuition Fees - Semester 2</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 mt-1">
                                <span>Due by <span className="text-red-400 font-medium">Oct 15, 2023</span> (Overdue)</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>Academic Year 2023-24</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-xl font-bold text-white">$2,200.00</span>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20 w-32">
                                Pay Now
                            </button>
                        </div>
                    </div>

                    {/* Payment Card 2 */}
                    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-lg">
                        <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-indigo-500">menu_book</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-semibold text-lg">Library Membership Fee</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 mt-1">
                                <span>Due by <span className="text-slate-300">Oct 28, 2023</span></span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>Annual Subscription</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-xl font-bold text-white">$250.00</span>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20 w-32">
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Payments Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-blue-400">schedule</span>
                    <h2 className="text-lg font-bold text-white">Upcoming Payments</h2>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Upcoming Card 1 */}
                    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
                        <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-emerald-500">sports_soccer</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-semibold text-lg">Sports & Gymkhana Fee</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 mt-1">
                                <span>Due by Nov 15, 2023</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>Winter Term</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-xl font-bold text-white">$150.00</span>
                            <button className="border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-blue-500 px-6 py-2 rounded-lg font-medium transition-colors w-32">
                                Pay Early
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Card 2 */}
                    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
                        <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-purple-500">science</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-semibold text-lg">Laboratory Maintenance Fee</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 mt-1">
                                <span>Due by Dec 05, 2023</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>Engineering Lab</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-xl font-bold text-white">$400.00</span>
                            <button className="border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-blue-500 px-6 py-2 rounded-lg font-medium transition-colors w-32">
                                Pay Early
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="mt-10 bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
                <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-400">help</span>
                </div>
                <div className="flex-1">
                    <h4 className="text-white font-semibold">Need help with payments?</h4>
                    <p className="text-sm text-slate-400">Contact the finance office if you're experiencing issues or want to request a waiver.</p>
                </div>
                <button className="bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    );
}
