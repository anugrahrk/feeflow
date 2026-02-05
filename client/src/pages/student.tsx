import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './login.css'; // Preserving existing import

function Student() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden">
            <div className="flex h-screen w-full overflow-hidden relative">
                <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="flex flex-col flex-1 h-full overflow-hidden relative">
                    <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8">
                        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <a className="text-slate-500 hover:text-primary transition-colors" href="#">Dashboard</a>
                                <span className="text-slate-400">/</span>
                                <span className="text-[#111318] dark:text-white font-medium">Students</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Students: <span className="text-[#111318] dark:text-white font-bold text-lg">1,284</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                        Filter
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Export
                                    </button>
                                    <button
                                        onClick={() => setIsAddStudentModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 ml-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        Add New Student
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white dark:bg-[#1a2230] shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile Number</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recurring Date</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center text-sm font-bold">JD</div>
                                                        <span className="font-medium">John Doe</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">john.doe@example.com</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">+1 234-567-8901</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">15th of month</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-bold whitespace-nowrap">$450.00</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="Edit">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-[#111318] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="More">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">AS</div>
                                                        <span className="font-medium">Alice Smith</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">alice.s@school.edu</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">+1 987-654-3210</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">01st of month</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-bold whitespace-nowrap">$1,200.00</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="Edit">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-[#111318] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="More">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">MJ</div>
                                                        <span className="font-medium">Michael Jordan</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">m.jordan@gmail.com</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">+1 555-012-3456</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">20th of month</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-bold whitespace-nowrap">$750.00</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="Edit">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-[#111318] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="More">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold">SW</div>
                                                        <span className="font-medium">Sarah Wilson</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">sarah.w@example.com</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">+1 444-222-3333</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">10th of month</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-bold whitespace-nowrap">$450.00</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="Edit">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-[#111318] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="More">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-sm font-bold">DR</div>
                                                        <span className="font-medium">David Ross</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">d.ross@university.edu</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">+1 777-888-9999</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white whitespace-nowrap">05th of month</td>
                                                <td className="px-6 py-4 text-sm text-[#111318] dark:text-white font-bold whitespace-nowrap">$1,500.00</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="Edit">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-[#111318] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="More">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a2230] flex items-center justify-between">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="text-[#111318] dark:text-white font-medium">1 to 5</span> of <span className="text-[#111318] dark:text-white font-medium">1,284</span> students</p>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 transition-colors" >Previous</button>
                                        <button className="px-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Add Student Modal */}
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
                            <h3 className="text-xl font-bold text-white">Add Student</h3>
                            <button
                                onClick={() => setIsAddStudentModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-300">Student Name</label>
                                <input
                                    type="text"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                                    <input
                                        type="tel"
                                        className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Fees Recurring Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-6 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="0.00"
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
                                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-medium"
                                >
                                    Save Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Student