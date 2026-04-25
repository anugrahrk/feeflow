import { useState, useEffect } from 'react';
import { useStudentStore } from '../store/studentStore';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import './login.css';

function Student() {
    const { students, fetchStudents, registerStudent, updateStudent, toggleStatus, sendReminder, isLoading, pagination } = useStudentStore();
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    // State for Search and Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // State for Edit/Actions
    const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<any | null>(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'disable' | 'reminder' | null;
        studentId: string | null;
        studentName?: string;
        isEnabled?: boolean; // For disable/enable text
    }>({ isOpen: false, type: null, studentId: null });
    const [isConfirming, setIsConfirming] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        recurrenceDay: '', // Day of month 1-31
        amount: ''
    });

    useEffect(() => {
        // Debounce search slightly or fetch on change
        const timeoutId = setTimeout(() => {
            fetchStudents({ page: currentPage, search: searchQuery, limit: 5 });
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchStudents, currentPage, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleAddClick = () => {
        setEditingStudent(null);
        setFormData({ name: '', email: '', mobile: '', recurrenceDay: '', amount: '' });
        setIsAddStudentModalOpen(true);
    };

    const handleEditClick = (student: any) => {
        setEditingStudent(student);
        setFormData({
            name: student.studentName,
            email: student.email,
            mobile: student.mobileNumber || '',
            recurrenceDay: student.feeRecurringDate ? new Date(student.feeRecurringDate).getDate().toString() : '',
            amount: student.amount.toString()
        });
        setIsAddStudentModalOpen(true);
        setActionMenuOpenId(null);
    };

    // Modified Handlers to open Modal
    const handleDisableClick = (student: any) => {
        setConfirmModal({
            isOpen: true,
            type: 'disable',
            studentId: student._id,
            studentName: student.studentName,
            isEnabled: student.isEnabled
        });
        setActionMenuOpenId(null);
    };

    const handleSendReminder = (student: any) => {
        setConfirmModal({
            isOpen: true,
            type: 'reminder',
            studentId: student._id,
            studentName: student.studentName
        });
        setActionMenuOpenId(null);
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.studentId || !confirmModal.type) return;

        setIsConfirming(true);
        try {
            if (confirmModal.type === 'disable') {
                await toggleStatus(confirmModal.studentId);
                toast.success(`Student ${confirmModal.isEnabled ? 'disabled' : 'enabled'} successfully`);
            } else if (confirmModal.type === 'reminder') {
                await sendReminder(confirmModal.studentId);
                toast.success("Payment reminder sent successfully");
            }
            // Close only on success
            setConfirmModal({ isOpen: false, type: null, studentId: null });
        } catch (error) {
            console.error("Action failed", error);
            toast.error("Action failed. Please try again.");
            // Keep modal open on error? User said "when sending is success full then only close".
        } finally {
            setIsConfirming(false);
        }
    };

    const { getToken } = useAuth();

    const handleExportClick = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/students/report/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
            } else {
                toast.error("Failed to generate PDF");
            }
        } catch (e) {
            toast.error("Error exporting PDF");
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Calculate next recurring date
            const day = Number(formData.recurrenceDay);
            const now = new Date();
            let nextDate = new Date(now.getFullYear(), now.getMonth(), day);
            if (nextDate < now) {
                // If date passed this month, move to next month
                nextDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
            }

            const payload = {
                studentName: formData.name,
                email: formData.email,
                mobileNumber: formData.mobile,
                amount: Number(formData.amount),
                feeRecurringDate: nextDate.toISOString()
            };

            if (editingStudent) {
                await updateStudent(editingStudent._id, payload);
                toast.success("Student updated successfully");
            } else {
                await registerStudent(payload);
                toast.success("Student added successfully");
            }

            setIsAddStudentModalOpen(false);
            setEditingStudent(null);
            setFormData({ name: '', email: '', mobile: '', recurrenceDay: '', amount: '' });
            fetchStudents({ page: currentPage, search: searchQuery, limit: 5 }); // Refresh list
        } catch (error) {
            console.error(editingStudent ? "Failed to update" : "Failed to register", error);
            toast.error(editingStudent ? "Failed to update student" : "Failed to register student");
        }
    };

    return (
        <div className="p-6 md:p-8" onClick={() => setActionMenuOpenId(null)}>
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-2 text-sm">
                    <a className="text-slate-500 hover:text-primary transition-colors" href="#">Dashboard</a>
                    <span className="text-slate-400">/</span>
                    <span className="text-[#111318] dark:text-white font-medium">Students</span>
                </div>

                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Students: <span className="text-[#111318] dark:text-white font-bold text-lg">{pagination?.total || 0}</span></p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search students..."
                                    className="w-full bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-[#111318] dark:text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleExportClick}
                            className="px-4 py-2 rounded-lg bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Export
                        </button>
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 ml-1 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Add Student
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl bg-white dark:bg-[#1a2230] shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px]">
                    <div className="overflow-x-auto flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8 h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-md">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile Number</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recurring Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {students && students.length > 0 ? (
                                        students.map((student: any) => (
                                            <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-9 rounded-full ${student.isEnabled ? 'bg-blue-100 dark:bg-blue-900/30 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'} flex items-center justify-center text-sm font-bold`}>
                                                            {student.studentName ? student.studentName.substring(0, 2).toUpperCase() : 'ST'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-medium ${!student.isEnabled ? 'text-slate-400' : ''}`}>{student.studentName || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{student.email}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{student.mobileNumber || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    {student.feeRecurringDate ? `${new Date(student.feeRecurringDate).getDate()}th of month` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-bold whitespace-nowrap">
                                                    ${student.amount?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.isEnabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {student.isEnabled ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActionMenuOpenId(actionMenuOpenId === student._id ? null : student._id);
                                                        }}
                                                        className={`p-1.5 rounded-lg transition-all ${actionMenuOpenId === student._id ? 'text-[#111318] dark:text-white bg-slate-100 dark:bg-slate-800' : 'text-slate-400 hover:text-[#111318] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {actionMenuOpenId === student._id && (
                                                        <div
                                                            className="absolute right-8 top-8 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <button
                                                                onClick={() => handleEditClick(student)}
                                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendReminder(student)}
                                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">notifications</span>
                                                                Send Reminder
                                                            </button>
                                                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-0.5"></div>
                                                            <button
                                                                onClick={() => handleDisableClick(student)}
                                                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${student.isEnabled ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">{student.isEnabled ? 'block' : 'check_circle'}</span>
                                                                {student.isEnabled ? 'Disable' : 'Enable'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                                No students found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between shrink-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium text-[#111318] dark:text-white">{pagination?.startIndex || 0}</span>-<span className="font-medium text-[#111318] dark:text-white">{pagination?.endIndex || 0}</span> of <span className="font-medium text-[#111318] dark:text-white">{pagination?.total || 0}</span> students
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
                                disabled={!pagination || currentPage >= pagination.totalPages}
                                className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Student Modal */}
            {isAddStudentModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsAddStudentModalOpen(false)}
                >
                    <div
                        className="bg-[#1a2230] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
                            <button
                                onClick={() => setIsAddStudentModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-300">Student Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="+1 (555) 000-0000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Fees Recurring Day</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="recurrenceDay"
                                            value={formData.recurrenceDay}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="31"
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]"
                                            placeholder="Day (1-31)"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-6 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddStudentModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : (editingStudent ? 'Save Changes' : 'Save Student')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => { if (!isConfirming) setConfirmModal({ ...confirmModal, isOpen: false }); }}
                >
                    <div
                        className="bg-[#1a2230] border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-2">
                            {confirmModal.type === 'disable'
                                ? (confirmModal.isEnabled ? "Disable Student" : "Enable Student")
                                : "Send Reminder"}
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">
                            {confirmModal.type === 'disable'
                                ? `Are you sure you want to ${confirmModal.isEnabled ? 'disable' : 'enable'} ${confirmModal.studentName}?`
                                : `Are you sure you want to send a payment reminder to ${confirmModal.studentName}? This will send an email.`}
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                                disabled={isConfirming}
                                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                disabled={isConfirming}
                                className={`px-4 py-2 rounded-lg text-white transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 ${confirmModal.type === 'disable' && confirmModal.isEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-blue-600'}`}
                            >
                                {isConfirming && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {isConfirming ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Student