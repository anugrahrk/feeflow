import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function StudentHome() {
    const { user } = useUser();
    const navigate = useNavigate();

    const handlePay = () => {
        navigate(`/pay/${user?.id || 'guest'}`, {
            state: {
                amount: 1250,
                description: "Outstanding Tuition Payment",
                dueDate: "Immediate"
            }
        });
    };

    return (
        <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-[#111318] dark:text-white mb-8">
                Student Portal
            </h1>

            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#111318] dark:text-white mb-2">
                    Welcome, {user?.firstName || 'Student'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 italic">
                    Immediate Action Required: Tuition Payment Due
                </p>
            </div>

            {/* Outstanding Payment CTA */}
            <div className="bg-[#0f172a] rounded-2xl p-6 mb-8 border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <p className="text-white font-medium mb-1">Outstanding Tuition Payment</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">₹1,250.00</span>
                            <span className="text-blue-400 font-medium">INR</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">Payment for October</p>
                    </div>
                    <button
                        onClick={handlePay}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined">payments</span>
                        Pay Now
                    </button>
                </div>
                {/* Glow Effect */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total Fees Paid */}
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-500">account_balance_wallet</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Fees Paid</p>
                        <p className="text-2xl font-bold text-white">$12,450.00</p>
                    </div>
                </div>

                {/* Outstanding Balance */}
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-500">pending_actions</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Outstanding Balance</p>
                        <p className="text-2xl font-bold text-white">$1,250.00</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">Recent Activity & Due Dates</h3>
                    <button className="text-blue-500 text-sm font-medium hover:text-blue-400 transition-colors">View All History</button>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1e293b] text-slate-400 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Payment Method</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">Sep 12, 2023</td>
                                    <td className="px-6 py-4">#TXN-7712</td>
                                    <td className="px-6 py-4">Credit Card</td>
                                    <td className="px-6 py-4 font-bold text-white">$2,500.00</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                            <span className="size-1.5 rounded-full bg-green-500"></span>
                                            Success
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">Aug 05, 2023</td>
                                    <td className="px-6 py-4">#TXN-6541</td>
                                    <td className="px-6 py-4">Bank Transfer</td>
                                    <td className="px-6 py-4 font-bold text-white">$1,200.00</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                            <span className="size-1.5 rounded-full bg-green-500"></span>
                                            Success
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">Jul 15, 2023</td>
                                    <td className="px-6 py-4">#TXN-5520</td>
                                    <td className="px-6 py-4">UPI / Net Banking</td>
                                    <td className="px-6 py-4 font-bold text-white">$800.00</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                            <span className="size-1.5 rounded-full bg-green-500"></span>
                                            Success
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
