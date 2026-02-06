import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function SuperAdmin() {
    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Mock Data
    const stats = [
        { label: 'Total Orgs', value: '128', color: 'text-white', bg: 'bg-white/5' },
        { label: 'Active', value: '124', color: 'text-green-500', bg: 'bg-white/5' },
        { label: 'Pending', value: '4', color: 'text-orange-500', bg: 'bg-white/5' },
        { label: 'Total Users', value: '15,402', color: 'text-blue-500', bg: 'bg-white/5' },
    ];

    const organizations = [
        { id: 1, name: 'Horizon Academy', owner: 'Dr. Robert Chen', email: 'robert.c@horizon.edu', phone: '+1 234 567 8901', joinDate: 'Oct 12, 2023', avatarBg: 'bg-blue-600', initials: 'HA' },
        { id: 2, name: 'Sky Valley High', owner: 'Sarah Jenkins', email: 'admin@skyvalley.com', phone: '+1 987 654 3210', joinDate: 'Nov 05, 2023', avatarBg: 'bg-purple-600', initials: 'SV' },
        { id: 3, name: 'North Star Institute', owner: 'Michael Thorne', email: 'm.thorne@northstar.org', phone: '+1 555 012 3456', joinDate: 'Jan 22, 2024', avatarBg: 'bg-green-600', initials: 'NS' },
        { id: 4, name: 'Elite Prep', owner: 'Lisa Wong', email: 'billing@eliteprep.edu', phone: '+1 415 999 0011', joinDate: 'Feb 14, 2024', avatarBg: 'bg-orange-600', initials: 'EP' },
        { id: 5, name: 'Beacon College', owner: 'James Wilson', email: 'j.wilson@beacon.ac.uk', phone: '+44 20 7946 0958', joinDate: 'Mar 01, 2024', avatarBg: 'bg-cyan-600', initials: 'BC' },
    ];

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
            {/* Navbar - Passing no-op for sidebar toggle since it's not needed here */}
            <Navbar setIsMobileMenuOpen={() => { }} />

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Registered Organizations</h1>
                            <p className="text-slate-400 text-sm">Manage and monitor all active platform tenants.</p>
                        </div>
                        <button
                            onClick={() => setIsAddOrgModalOpen(true)}
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Add Organisation
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 shadow-sm">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-800/50 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Details</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Join Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {organizations.map((org) => (
                                        <tr key={org.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-10 rounded-lg ${org.avatarBg} flex items-center justify-center text-sm font-bold text-white`}>
                                                        {org.initials}
                                                    </div>
                                                    <span className="font-semibold text-white">{org.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{org.owner}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-white">{org.email}</span>
                                                    <span className="text-xs text-slate-500">{org.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">{org.joinDate}</td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
                            <p className="text-sm text-slate-400">Showing 1 to 5 of 128 organizations</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-sm border border-slate-700 rounded hover:bg-slate-800 text-slate-300 transition-colors">Previous</button>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded font-medium">1</button>
                                    <button className="px-3 py-1.5 text-sm border border-slate-700 rounded hover:bg-slate-800 text-slate-300 transition-colors">2</button>
                                </div>
                                <button className="px-3 py-1.5 text-sm border border-slate-700 rounded hover:bg-slate-800 text-slate-300 transition-colors">Next</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add Org Modal */}
            {isAddOrgModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsAddOrgModalOpen(false)}
                >
                    <div
                        className="bg-[#1e293b] border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
                            <h3 className="text-lg font-bold text-white">Add New Organisation</h3>
                            <button
                                onClick={() => setIsAddOrgModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            <form className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Organisation Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter organisation name"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Owner Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter owner's full name"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Email ID</label>
                                        <input
                                            type="email"
                                            placeholder="owner@organisation.com"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddOrgModalOpen(false)}
                                        className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-[#0f172a] border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-colors"
                                    >
                                        Create Organisation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
