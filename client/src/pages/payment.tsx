import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import api from "../api/axios";

interface Student {
    _id: string;
    studentName: string;
    amount: number;
    feeRecurringDate: string;
}

interface StudentData {
    student: Student;
    outstandingBalance: number;
    isPaidForCurrentMonth: boolean;
}

interface Payment {
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
    razorpayPaymentId?: string;
}

export default function Payment() {
    const navigate = useNavigate();
    useUser();
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, transactionsRes] = await Promise.all([
                    api.get('/api/student/profile'),
                    api.get('/api/student/transactions')
                ]);
                setStudentData(profileRes.data);
                setTransactions(transactionsRes.data);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePay = (amount: number, description: string) => {
        if (!studentData?.student) return;
        const recurringDay = new Date(studentData.student.feeRecurringDate).getDate();
        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth(), recurringDay).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        navigate(`/pay/${studentData.student._id}`, {
            state: {
                amount,
                description,
                dueDate
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
            link.setAttribute('download', `receipt_${paymentId}.pdf`); // or extract filename from header
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading receipt:", error);
            alert("Failed to download receipt.");
        }
    };

    if (loading) {
        return <div className="p-8 text-white flex justify-center items-center h-screen">Loading payment details...</div>;
    }

    if (!studentData) {
        return <div className="p-8 text-white flex justify-center items-center h-screen text-xl">No data available.</div>;
    }

    const nextPaymentDate = (() => {
        if (transactions.length > 0 && transactions[0].createdAt) {
            const lastPaymentDate = new Date(transactions[0].createdAt);
            const nextDate = new Date(lastPaymentDate);
            nextDate.setDate(nextDate.getDate() + 30);
            return nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        // Fallback if no transactions
        const recurringDay = new Date(studentData.student.feeRecurringDate).getDate();
        const today = new Date();
        // If already paid this month, next month
        // If not paid, this month (but this block is for "Verified Upcoming", so likely next month)
        let targetMonth = today.getMonth();
        if (studentData.isPaidForCurrentMonth) {
            targetMonth += 1;
        }
        return new Date(today.getFullYear(), targetMonth, recurringDay).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#111318] dark:text-white">
                    My Payments
                </h1>
            </div>

            {/* Pending Payments Section */}
            {!studentData.isPaidForCurrentMonth ? (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        <h2 className="text-lg font-bold text-white">Pending Payments</h2>
                        <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium ml-auto border border-red-500/20">Action Required</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-lg">
                            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-blue-500">school</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-white font-semibold text-lg">Monthly Tuition Fee</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    Please clear your dues to avoid late fees.
                                </p>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-2">
                                <span className="text-xl font-bold text-white">${studentData.student.amount}</span>
                                <button
                                    onClick={() => handlePay(studentData.student.amount, "Monthly Tuition Fee")}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20 w-32"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                        <h2 className="text-lg font-bold text-white">All Caught Up!</h2>
                    </div>
                    <p className="text-slate-400">You have no pending payments for this month.</p>
                </div>
            )}

            {/* Upcoming Payments Section */}
            {studentData.isPaidForCurrentMonth && (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-400">schedule</span>
                        <h2 className="text-lg font-bold text-white">Upcoming Payments</h2>
                    </div>

                    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
                        <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-blue-500">calendar_month</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-semibold text-lg">Next Monthly Fee</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 mt-1">
                                <span>Expected by {nextPaymentDate}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-xl font-bold text-white">${studentData.student.amount}</span>
                            <span className="text-xs text-slate-500">Auto-calculated</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-slate-400">history</span>
                    <h2 className="text-lg font-bold text-white">Payment History</h2>
                </div>

                <div className="flex flex-col gap-3">
                    {transactions.length === 0 ? (
                        <p className="text-slate-500 italic">No payment history available.</p>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx._id} className="bg-[#1e293b]/50 border border-slate-800 rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">${tx.amount}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </p>
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        tx.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </div>
                                {tx.status === 'completed' && (
                                    <button
                                        onClick={() => handleDownloadReceipt(tx._id)}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        Receipt
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
