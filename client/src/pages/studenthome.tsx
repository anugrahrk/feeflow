import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "../store/studentStore";
import { useEffect, useMemo } from "react";
import api from "../api/axios";

export default function StudentHome() {
    const { user } = useUser();
    const navigate = useNavigate();
    const {
        studentProfile,
        outstandingBalance,
        transactions,
        fetchStudentProfile,
        fetchMyTransactions,
        isLoading
    } = useStudentStore();

    useEffect(() => {
        fetchStudentProfile();
        fetchMyTransactions();
    }, [fetchStudentProfile, fetchMyTransactions]);

    const handlePay = () => {
        navigate(`/pay/${studentProfile?._id || 'guest'}`, {
            state: {
                amount: outstandingBalance || 1250, // Default if 0? Or just use outstanding
                description: "Tuition Payment",
                dueDate: "Immediate"
            }
        });
    };

    const handleDownloadReceipt = async (paymentId: string) => {
        try {
            const response = await api.get(`/payments/receipt/${paymentId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt_${paymentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading receipt:", error);
            alert("Failed to download receipt.");
        }
    };

    const totalFeesPaid = useMemo(() => {
        return transactions
            .filter((txn: any) => txn.status === 'completed' || txn.status === 'Success')
            .reduce((acc: number, curr: any) => acc + curr.amount, 0);
    }, [transactions]);

    return (
        <div className="p-6 md:p-8">
            {/* <h1 className="text-2xl font-bold text-[#111318] dark:text-white mb-8">
                Student Portal
            </h1> */}

            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#111318] dark:text-white mb-2">
                    Welcome, {studentProfile?.studentName || user?.firstName || 'Student'}
                </h2>
                {outstandingBalance > 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                        Immediate Action Required: Tuition Payment Due
                    </p>
                ) : (
                    <p className="text-green-600 dark:text-green-400 italic">
                        You are all caught up on payments!
                    </p>
                )}
            </div>

            {/* Outstanding Payment CTA */}
            <div className="bg-[#0f172a] rounded-2xl p-6 mb-8 border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <p className="text-white font-medium mb-1">Outstanding Payment</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">₹{outstandingBalance.toLocaleString()}</span>
                            <span className="text-blue-400 font-medium">INR</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">
                            {outstandingBalance > 0 ? "Payment Due" : "No Pending Dues"}
                        </p>
                    </div>
                    {outstandingBalance > 0 && (
                        <button
                            onClick={handlePay}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined">payments</span>
                            Pay Now
                        </button>
                    )}
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
                        <p className="text-2xl font-bold text-white">₹{totalFeesPaid.toLocaleString()}</p>
                    </div>
                </div>

                {/* Outstanding Balance */}
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-500">pending_actions</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Outstanding Balance</p>
                        <p className="text-2xl font-bold text-white">₹{outstandingBalance.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">Recent Activity</h3>
                    {/* <button className="text-blue-500 text-sm font-medium hover:text-blue-400 transition-colors">View All History</button> */}
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
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
                                    {transactions.length > 0 ? (
                                        transactions.map((txn: any) => (
                                            <tr key={txn._id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">{new Date(txn.createdAt || txn.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">#{txn.razorpayPaymentId || txn.transactionId || 'N/A'}</td>
                                                <td className="px-6 py-4">Online</td>
                                                <td className="px-6 py-4 font-bold text-white">₹{txn.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit
                                                        ${txn.status === 'completed' || txn.status === 'Success' ? 'bg-green-500/10 text-green-500' :
                                                            txn.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        <span className={`size-1.5 rounded-full 
                                                            ${txn.status === 'completed' || txn.status === 'Success' ? 'bg-green-500' :
                                                                txn.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                                        {txn.status === 'completed' ? 'Success' : txn.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {(txn.status === 'completed' || txn.status === 'Success') && (
                                                        <button
                                                            onClick={() => handleDownloadReceipt(txn._id)}
                                                            className="text-slate-400 hover:text-white transition-colors"
                                                            title="Download Receipt"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                No recent transactions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
