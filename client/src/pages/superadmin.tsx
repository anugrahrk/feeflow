import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function SuperAdmin() {
    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);


    // Action Menu State
    const [actionMenuOpenId, setActionMenuOpenId] = useState<number | null>(null);
    const [editingOrg, setEditingOrg] = useState<any | null>(null);

    // Disable Confirmation State
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [orgToDisable, setOrgToDisable] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        owner: '',
        email: '',
        phone: '',
    });

    // Mock Data
    const stats = [
        { label: 'Total Orgs', value: '128', color: 'text-white', bg: 'bg-white/5' },
        { label: 'Active', value: '124', color: 'text-green-500', bg: 'bg-white/5' },
        { label: 'Disabled', value: '4', color: 'text-orange-500', bg: 'bg-white/5' },
        // { label: 'Total Users', value: '15,402', color: 'text-blue-500', bg: 'bg-white/5' },
    ];

    const [organizations, setOrganizations] = useState([
        { id: 1, name: 'Horizon Academy', owner: 'Dr. Robert Chen', email: 'robert.c@horizon.edu', phone: '+1 234 567 8901', joinDate: 'Oct 12, 2023', avatarBg: 'bg-blue-600', initials: 'HA', status: 'Active' },
        { id: 2, name: 'Sky Valley High', owner: 'Sarah Jenkins', email: 'admin@skyvalley.com', phone: '+1 987 654 3210', joinDate: 'Nov 05, 2023', avatarBg: 'bg-purple-600', initials: 'SV', status: 'Active' },
        { id: 3, name: 'North Star Institute', owner: 'Michael Thorne', email: 'm.thorne@northstar.org', phone: '+1 555 012 3456', joinDate: 'Jan 22, 2024', avatarBg: 'bg-green-600', initials: 'NS', status: 'Active' },
        { id: 4, name: 'Elite Prep', owner: 'Lisa Wong', email: 'billing@eliteprep.edu', phone: '+1 415 999 0011', joinDate: 'Feb 14, 2024', avatarBg: 'bg-orange-600', initials: 'EP', status: 'Active' },
        { id: 5, name: 'Beacon College', owner: 'James Wilson', email: 'j.wilson@beacon.ac.uk', phone: '+44 20 7946 0958', joinDate: 'Mar 01, 2024', avatarBg: 'bg-cyan-600', initials: 'BC', status: 'Active' },
    ]);

    // Handle clicking outside to close menus
    const handleBackdropClick = () => {
        if (actionMenuOpenId !== null) setActionMenuOpenId(null);
    };

    const handleEdit = (org: any) => {
        setEditingOrg(org);
        setFormData({
            name: org.name,
            owner: org.owner,
            email: org.email,
            phone: org.phone,
        });
        setIsAddOrgModalOpen(true);
        setActionMenuOpenId(null);
    };

    const handleDisableClick = (org: any) => {
        setOrgToDisable(org);
        setIsDisableModalOpen(true);
        setActionMenuOpenId(null);
    };

    const confirmDisable = () => {
        if (orgToDisable) {
            setOrganizations(organizations.map(org =>
                org.id === orgToDisable.id ? { ...org, status: org.status === 'Active' ? 'Disabled' : 'Active' } : org
            ));
            setIsDisableModalOpen(false);
            setOrgToDisable(null);
        }
    };

    const handleModalClose = () => {
        setIsAddOrgModalOpen(false);
        setEditingOrg(null);
        setFormData({ name: '', owner: '', email: '', phone: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-white font-sans overflow-hidden" onClick={handleBackdropClick}>
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
                            onClick={() => {
                                setEditingOrg(null);
                                setFormData({ name: '', owner: '', email: '', phone: '' });
                                setIsAddOrgModalOpen(true);
                            }}
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
                    <div className="bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shadow-sm h-[500px] flex flex-col">
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-800/50 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Details</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Join Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {organizations.map((org) => (
                                        <tr key={org.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center gap-3 ${org.status === 'Disabled' ? 'opacity-50' : ''}`}>
                                                    <div className={`size-10 rounded-lg ${org.avatarBg} flex items-center justify-center text-sm font-bold text-white`}>
                                                        {org.initials}
                                                    </div>
                                                    <span className="font-semibold text-white">{org.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                                                <span className={org.status === 'Disabled' ? 'opacity-50' : ''}>{org.owner}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex flex-col ${org.status === 'Disabled' ? 'opacity-50' : ''}`}>
                                                    <span className="text-sm text-white">{org.email}</span>
                                                    <span className="text-xs text-slate-500">{org.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${org.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {org.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                                <span className={org.status === 'Disabled' ? 'opacity-50' : ''}>{org.joinDate}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionMenuOpenId(actionMenuOpenId === org.id ? null : org.id);
                                                    }}
                                                    className={`text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors ${actionMenuOpenId === org.id ? 'text-white bg-slate-700' : ''}`}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>

                                                {/* Action Menu Dropdown */}
                                                {actionMenuOpenId === org.id && (
                                                    <div
                                                        className="absolute right-8 top-8 w-40 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => handleEdit(org)}
                                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 text-left transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDisableClick(org)}
                                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 text-left transition-colors border-t border-slate-800"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">{org.status === 'Active' ? 'block' : 'check_circle'}</span>
                                                            {org.status === 'Active' ? 'Disable' : 'Enable'}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between shrink-0">
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

            {/* Add/Edit Org Modal */}
            {isAddOrgModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={handleModalClose}
                >
                    <div
                        className="bg-[#1e293b] border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
                            <h3 className="text-lg font-bold text-white">
                                {editingOrg ? 'Edit Organisation' : 'Add New Organisation'}
                            </h3>
                            <button
                                onClick={handleModalClose}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleModalClose(); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Organisation Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Enter organisation name"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Owner Name</label>
                                        <input
                                            name="owner"
                                            value={formData.owner}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Enter owner's full name"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Email ID</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            type="email"
                                            placeholder="owner@organisation.com"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>

                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-[#0f172a] border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-colors"
                                    >
                                        {editingOrg ? 'Save Changes' : 'Create Organisation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Disable/Enable Confirmation Modal */}
            {isDisableModalOpen && orgToDisable && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsDisableModalOpen(false)}
                >
                    <div
                        className="bg-[#1e293b] border border-slate-800 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 text-center">
                            <div className={`mx-auto flex items-center justify-center size-12 rounded-full mb-4 ${orgToDisable.status === 'Active' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                <span className="material-symbols-outlined text-[24px]">
                                    {orgToDisable.status === 'Active' ? 'block' : 'check_circle'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {orgToDisable.status === 'Active' ? 'Disable Organisation?' : 'Enable Organisation?'}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to {orgToDisable.status === 'Active' ? 'disable' : 'enable'} <span className="font-semibold text-white">{orgToDisable.name}</span>?
                                {orgToDisable.status === 'Active' ? ' This will prevent access to their dashboard.' : ' This will restore access to their dashboard.'}
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setIsDisableModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-[#0f172a] border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDisable}
                                    className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${orgToDisable.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
