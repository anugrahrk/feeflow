import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Admin() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const mockChartData = [
        { name: 'Week 1', value: 4000 },
        { name: 'Week 2', value: 3000 },
        { name: 'Week 3', value: 5000 },
        { name: 'Week 4', value: 2780 },
        { name: 'Week 5', value: 1890 },
        { name: 'Week 6', value: 2390 },
        { name: 'Week 7', value: 3490 },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden">
            <div className="flex h-screen w-full overflow-hidden relative">
                <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="flex flex-col flex-1 h-full overflow-hidden relative">
                    <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8">
                        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <a className="text-slate-500 hover:text-primary transition-colors" href="#">Home</a>
                                <span className="text-slate-400">/</span>
                                <span className="text-[#111318] dark:text-white font-medium">Dashboard</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Collections</p>
                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[20px]">payments</span>
                                        </div>
                                    </div>
                                    <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight">$124,500</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="material-symbols-outlined text-green-600 text-[16px]">trending_up</span>
                                        <p className="text-green-600 text-sm font-medium">+5.2%</p>
                                        <span className="text-slate-400 text-sm ml-1">from last month</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Dues</p>
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-[20px]">pending_actions</span>
                                        </div>
                                    </div>
                                    <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight">$12,400</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="material-symbols-outlined text-orange-600 text-[16px]">trending_up</span>
                                        <p className="text-orange-600 text-sm font-medium">+1.8%</p>
                                        <span className="text-slate-400 text-sm ml-1">overdue increase</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Transaction Volume</p>
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
                                        </div>
                                    </div>
                                    <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight">342</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="material-symbols-outlined text-slate-400 text-[16px]">remove</span>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Stable</p>
                                        <span className="text-slate-400 text-sm ml-1">vs previous week</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-[#111318] dark:text-white text-lg font-bold">Fee Collection Trends</h3>
                                            <p className="text-slate-500 text-sm">Last 30 Days Performance</p>
                                        </div>
                                        <button className="text-primary hover:bg-blue-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                            View Report
                                        </button>
                                    </div>

                                    <div className="h-64 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={mockChartData}
                                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    hide={true}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        borderRadius: '8px',
                                                        border: '1px solid #e2e8f0',
                                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                    }}
                                                    itemStyle={{ color: '#1e293b' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#2563eb"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorValue)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="lg:col-span-1 rounded-xl bg-primary text-white p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <span className="material-symbols-outlined text-[120px]">campaign</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 relative z-10">Fee Reminders</h3>
                                    <p className="text-blue-100 text-sm mb-6 relative z-10">You have 12 pending fee reminders scheduled for today. Send them now to improve collection rates.</p>
                                    <button className="bg-white text-primary w-full py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm relative z-10 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                        Send Reminders
                                    </button>
                                    <div className="mt-6 border-t border-white/20 pt-6 relative z-10">
                                        <h4 className="font-semibold text-sm mb-3">System Status</h4>
                                        <div className="flex items-center gap-2 text-sm text-blue-100">
                                            <span className="size-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                                            Payment Gateway Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-[#111318] dark:text-white text-lg font-bold">Recent Transactions</h3>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                            Filter
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">download</span>
                                            Export
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Oct 24, 2023</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium font-mono whitespace-nowrap">#TXN-8832</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 text-primary flex items-center justify-center text-xs font-bold">JD</div>
                                                        John Doe
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium whitespace-nowrap">$500.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        <span className="size-1.5 rounded-full bg-green-500"></span>
                                                        Success
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button className="text-slate-400 hover:text-primary p-1 rounded transition-colors" title="View Receipt">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Oct 24, 2023</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium font-mono whitespace-nowrap">#TXN-8831</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 flex items-center justify-center text-xs font-bold">JS</div>
                                                        Jane Smith
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium whitespace-nowrap">$1,200.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                        <span className="size-1.5 rounded-full bg-orange-500"></span>
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="text-primary hover:text-blue-700 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded" title="Send Reminder">
                                                            Remind
                                                        </button>
                                                        <button className="text-slate-400 hover:text-primary p-1 rounded transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Oct 23, 2023</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium font-mono whitespace-nowrap">#TXN-8830</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 flex items-center justify-center text-xs font-bold">RB</div>
                                                        Robert Brown
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium whitespace-nowrap">$500.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                        <span className="size-1.5 rounded-full bg-red-500"></span>
                                                        Failed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="text-red-600 hover:text-red-700 text-xs font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded" title="Retry Payment">
                                                            Retry
                                                        </button>
                                                        <button className="text-slate-400 hover:text-primary p-1 rounded transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Oct 23, 2023</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium font-mono whitespace-nowrap">#TXN-8829</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 flex items-center justify-center text-xs font-bold">EL</div>
                                                        Emily Lee
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium whitespace-nowrap">$2,450.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        <span className="size-1.5 rounded-full bg-green-500"></span>
                                                        Success
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button className="text-slate-400 hover:text-primary p-1 rounded transition-colors" title="View Receipt">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Oct 22, 2023</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium font-mono whitespace-nowrap">#TXN-8828</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 flex items-center justify-center text-xs font-bold">MJ</div>
                                                        Michael Jordan
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium whitespace-nowrap">$150.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        <span className="size-1.5 rounded-full bg-green-500"></span>
                                                        Success
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button className="text-slate-400 hover:text-primary p-1 rounded transition-colors" title="View Receipt">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1a2230] flex items-center justify-between">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing 1 to 5 of 45 entries</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-300">Previous</button>
                                        <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Admin