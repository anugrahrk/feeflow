
import { useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentState {
    amount: number;
    description: string;
    dueDate: string;
}

export default function Pay() {
    const { studentId } = useParams();
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'pending' | 'success' | 'failure' | 'already_paid'>('pending');
    const [txDetails, setTxDetails] = useState<{ id: string; amount: number; date: string } | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [redirectSeconds, setRedirectSeconds] = useState(5);

    // Default values if accessing directly without state (or just for testing)
    // Priority: State > Search Params > Default
    const paymentDetails: PaymentState = state || {
        amount: Number(searchParams.get('amount')) || 1250.00,
        description: searchParams.get('desc') || "Tuition Due: Immediate Action",
        dueDate: "October 31st"
    };

    useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!studentId) {
                setCheckingStatus(false);
                return;
            }

            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/payments/payment-status/${studentId}`);
                if (data.paid) {
                    setStatus('already_paid');
                    setTxDetails({
                        id: "PREV-PAID", // Or get from data if available
                        amount: paymentDetails.amount,
                        date: new Date(data.paymentDate).toLocaleString()
                    });

                    // Start countdown
                    const interval = setInterval(() => {
                        setRedirectSeconds((prev) => {
                            if (prev <= 1) {
                                clearInterval(interval);
                                navigate('/c');
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            } catch (error) {
                console.error("Error checking payment status", error);
                // Fallback to allowing payment if check fails? Or show error?
                // For now, let's allow payment but maybe log it
            } finally {
                setCheckingStatus(false);
            }
        };

        checkPaymentStatus();
    }, [studentId, navigate, paymentDetails.amount]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        // if (!user && !studentId) {
        if (!studentId) {

            toast.error("User information missing. Please login or use a valid link.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const { data: orderData } = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
                // studentId: studentId || user?.id || 'guest', // Fallback to guest if no ID
                studentId: studentId,
                amount: paymentDetails.amount
            });

            if (!orderData || !orderData.id) {
                throw new Error("Invalid order data received from server");
            }

            const res = await loadRazorpay();

            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.RAZORPAY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Global Institute",
                description: paymentDetails.description,
                image: "https://your-logo-url.com/logo.png",
                order_id: orderData.id, // Pass the order ID created in backend
                handler: async function (response: any) {
                    try {
                        // 2. Verify Payment
                        const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/payments/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            studentId: studentId,
                            amount: paymentDetails.amount,
                            organizationId: "org_default" // TODO: Get this from context if available
                        });

                        if (verifyRes.data.status === 'success') {
                            setStatus('success');
                            setTxDetails({
                                id: response.razorpay_payment_id,
                                amount: paymentDetails.amount,
                                date: new Date().toLocaleString()
                            });
                            toast.success(`Payment Successful! Transaction ID: ${response.razorpay_payment_id}`);
                        } else {
                            setStatus('failure');
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (verifyError) {
                        console.error("Verification Error:", verifyError);
                        setStatus('failure');
                        toast.error("Payment verified but failed to record. Please contact support.");
                    }
                },
                prefill: {
                    name: user?.fullName || "Student Name",
                    email: user?.primaryEmailAddress?.emailAddress || "student@example.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "Global Institute of Technology"
                },
                theme: {
                    color: "#3b82f6"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            console.error("Payment Error:", error);
            toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
            // Only set failure if it wasn't a user cancellation (handled by ondismiss usually, but Razorpay catches some errors)
            // setStatus('failure'); // Optional: decide if init errors show the failure screen
        } finally {
            // setLoading(false); // handled in ondismiss or success
        }
    };

    if (checkingStatus) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm animate-pulse">Checking payment status...</p>
                </div>
            </div>
        );
    }

    if (status === 'already_paid') {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
                <div className="bg-[#1a2230] text-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-800 p-8 text-center relative overflow-hidden">
                    <div className="size-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <span className="material-symbols-outlined text-blue-500 text-5xl">verified</span>
                        <span className="absolute top-2 right-2 size-4 bg-blue-500 rounded-full animate-ping"></span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Payment Already Completed</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        It looks like you have already paid for this fee category. No further action is required at this time.
                    </p>

                    <div className="bg-[#0f131a] rounded-xl p-4 mb-8 text-left border border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Transaction Details</p>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Fee Category</span>
                            <span className="text-white text-sm font-medium">Academic Year 2024/25</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Status</span>
                            <span className="flex items-center gap-1.5 text-blue-400 text-sm font-bold">
                                <span className="size-2 bg-blue-500 rounded-full"></span>
                                Settled
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/c')}
                        className="w-full bg-[#243042] hover:bg-[#334155] text-white font-bold py-3 rounded-xl transition-all border border-slate-700 mb-6"
                    >
                        Go to Dashboard
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="size-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Redirecting to your Profile in <span className="text-white font-bold">{redirectSeconds}s...</span>
                        </div>
                        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(redirectSeconds / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                        <span>Confirmation Hash</span>
                        <span>HASH-992-PXQ-Z011</span>
                    </div>

                    <div className="mt-4 text-center">
                        <a href="#" className="text-slate-500 hover:text-slate-400 text-xs underline">Need help? Contact our support team</a>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
                <div className="bg-[#1a2230] text-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-800 p-8 text-center">
                    <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
                    <p className="text-slate-400 text-sm mb-8">
                        Your transaction has been processed successfully. A confirmation email has been sent.
                    </p>

                    <div className="bg-[#243042] rounded-xl p-4 mb-8">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                            <span className="text-slate-400 text-sm">Amount Paid</span>
                            <span className="text-xl font-bold">₹{txDetails?.amount.toFixed(2)}</span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Transaction ID</span>
                                <span className="font-mono text-xs">{txDetails?.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Date & Time</span>
                                <span className="text-right">{txDetails?.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Payment Method</span>
                                <span className="flex items-center gap-1">
                                    <span className="bg-white/10 px-1 rounded text-[10px]">UPI</span>
                                    <span>••••</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/c')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-3"
                    >
                        Return to Dashboard
                    </button>

                    <button className="w-full bg-[#0f1115] hover:bg-slate-800 border border-slate-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download Receipt
                    </button>

                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <button className="text-blue-500 text-xs font-medium hover:text-blue-400 transition-colors">
                            Need help with this transaction? Contact Support
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'failure') {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
                <div className="bg-[#1a2230] text-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-800 p-8 text-center relative overflow-hidden">
                    {/* Background glow for error */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

                    <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-500 text-4xl">cancel</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
                    <p className="text-slate-400 text-sm mb-8">
                        We couldn't process your transaction.
                    </p>

                    <div className="bg-[#243042] rounded-xl p-4 mb-8 text-left border border-red-500/20">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Reason</p>
                        <p className="text-sm text-white mb-4">
                            The transaction was declined or failed to verify. Please check your connection or try a different payment method.
                        </p>
                        <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-700">
                            <span className="text-slate-500 uppercase font-bold">Error Code</span>
                            <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded">ERR_PAYMENT_FAILED</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setStatus('pending');
                            setLoading(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-3"
                    >
                        Try Again
                    </button>

                    <button className="w-full bg-[#0f1115] hover:bg-slate-800 border border-slate-700 text-white font-medium py-3 rounded-xl transition-all">
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
            <div className="bg-[#1a2230] text-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-800 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold">Payment Summary</h2>
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm">school</span>
                        </div>
                        <span className="font-semibold text-sm">Global Institute</span>
                    </div>
                </div>

                {/* content */}
                <div className="p-8">
                    <div className="flex justify-between mb-8 text-sm">
                        <div>
                            <h3 className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-xs">Student Information</h3>
                            <p className="text-xl font-bold">{user?.fullName || "Student Name"}</p>
                            <p className="text-slate-400">ID: {studentId ? `STU-${studentId}` : `STU-${new Date().getFullYear()}-0812`}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-xs">Billed By</h3>
                            <p className="font-medium">Global Institute of Technology</p>
                            <p className="text-slate-400">123 University Avenue, Science Park</p>
                            <p className="text-slate-400">California, US</p>
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-[#243042] rounded-xl p-6 border border-slate-700 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{paymentDetails.description}</h3>
                                <p className="text-blue-400 font-medium text-sm">Due by {paymentDetails.dueDate}</p>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">₹{paymentDetails.amount.toFixed(2)}</span>
                                    <span className="text-slate-400 text-sm">INR</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#0f1115] p-3 rounded-lg border border-slate-800">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Due Date</p>
                            <p className="text-white font-medium text-sm">October 31, 2024</p>
                        </div>
                        <div className="bg-[#0f1115] p-3 rounded-lg border border-slate-800">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Valid Till</p>
                            <p className="text-white font-medium text-sm">November 30, 2024</p>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? 'Processing...' : 'Pay Now with Razorpay'}
                        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>

                    <p className="text-center text-slate-500 text-xs mt-4">
                        Securely processed by Razorpay. Transaction fees may apply.
                    </p>
                </div>
            </div>
        </div>
    );
}
