import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStudentStore } from '../store/studentStore';
import { toast } from 'sonner';

function Admin() {
    const {
        monthlyStats,
        chartData,
        transactions,
        fetchMonthlyStats,
        fetchChartData,
        fetchTransactions,
        isLoading,
        transactionPagination,
        pendingCount,
        fetchPendingCount,
        sendBulkReminders
    } = useStudentStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isSendingReminders, setIsSendingReminders] = useState(false);

    useEffect(() => {
        fetchMonthlyStats();
        fetchChartData();
        fetchPendingCount();
    }, []);

    // Effect to handle page changes and initial load for transactions
    useEffect(() => {
        fetchTransactions({ page: currentPage, limit: 10 });
    }, [currentPage, fetchTransactions]);

    const handlePageChange = (newPage: number) => {
        if (transactionPagination && newPage >= 1 && newPage <= transactionPagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSendReminders = () => {
        setIsReminderModalOpen(true);
    };

    const confirmSendReminders = async () => {
        setIsSendingReminders(true);
        try {
            const response = await sendBulkReminders();
            toast.success(response.message);
            setIsReminderModalOpen(false);
            fetchPendingCount(); // Refresh count
        } catch (error) {
            toast.error('Failed to send reminders');
        } finally {
            setIsSendingReminders(false);
        }
    };

    if (isLoading && !monthlyStats && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }
    console.log(transactions)
    return (
        <div className="p-6 md:p-8">
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
                        <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight">₹{monthlyStats?.totalCollections?.toLocaleString() ?? '0'}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <span className="material-symbols-outlined text-green-600 text-[16px]">trending_up</span>
                            <p className="text-green-600 text-sm font-medium">+{monthlyStats?.collectionGrowth ?? 0}%</p>
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
                        <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight">₹{monthlyStats?.pendingDues?.toLocaleString() ?? '0'}</p>
                        <div className="flex items-center gap-1 mt-2">
                            {/* <span className="material-symbols-outlined text-orange-600 text-[16px]">trending_up</span> */}
                            {/* <p className="text-orange-600 text-sm font-medium">+{monthlyStats?.pendingGrowth ?? 0}%</p> */}
                            {/* <span className="text-slate-400 text-sm ml-1">overdue increase</span> */}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Transaction Volume</p>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
                            </div>
                        </div>
                        <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight">{monthlyStats?.transactionVolume ?? 0}</p>
                        <div className="flex items-center gap-1 mt-2">
                            {/* <span className="material-symbols-outlined text-slate-400 text-[16px]">remove</span>    
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Stable</p>
                            <span className="text-slate-400 text-sm ml-1">vs previous week</span> */}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#1a2230] shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-[#111318] dark:text-white text-lg font-bold">Fee Collection Trends</h3>
                                <p className="text-slate-500 text-sm">Last 6 Months Performance</p>
                            </div>
                            {/* <button className="text-primary hover:bg-blue-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                View Report
                            </button> */}
                        </div>

                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData || []}
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
                        <p className="text-blue-100 text-sm mb-6 relative z-10">
                            You have {pendingCount} pending fee reminders scheduled for today. Send them now to improve collection rates.
                        </p>
                        <button
                            onClick={handleSendReminders}
                            className="bg-white text-primary w-full py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm relative z-10 flex items-center justify-center gap-2"
                        >
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
                        {/* removed filter and export buttons */}
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {transactions.length > 0 ? (
                                    transactions.map((txn) => (
                                        <tr key={txn._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {new Date(txn.date).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium font-mono whitespace-nowrap">
                                                {txn.transactionId.slice(4, 12)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 text-primary flex items-center justify-center text-xs font-bold">
                                                        {txn.studentName ? txn.studentName.substring(0, 2).toUpperCase() : 'ST'}
                                                    </div>
                                                    {txn.studentName || 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-medium whitespace-nowrap">
                                                ₹{txn.amount?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                                                    ${txn.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    <span className={`size-1.5 rounded-full 
                                                        ${txn.status === 'completed' ? 'bg-green-500' :
                                                            txn.status === 'pending' ? 'bg-yellow-500' :
                                                                'bg-red-500'}`}></span>
                                                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No recent transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {transactionPagination && (
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between shrink-0">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span className="font-medium text-[#111318] dark:text-white">{transactionPagination.startIndex}</span>-<span className="font-medium text-[#111318] dark:text-white">{transactionPagination.endIndex}</span> of <span className="font-medium text-[#111318] dark:text-white">{transactionPagination.total}</span> transactions
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded font-medium">
                                        {currentPage}
                                    </button>
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!transactionPagination || currentPage >= transactionPagination.totalPages}
                                    className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reminder Modal */}
            {isReminderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2">Send Payment Reminders</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Are you sure you want to send reminders to all {pendingCount} pending students? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsReminderModalOpen(false)}
                                disabled={isSendingReminders}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSendReminders}
                                disabled={isSendingReminders}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSendingReminders ? (
                                    <>
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Yes, Send Reminders'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin