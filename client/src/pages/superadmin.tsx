import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useOrgStore } from '../store/orgStore';
import { toast } from 'sonner';

export default function SuperAdmin() {
    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
    const { organizations, suggestions, pagination, stats, fetchOrganizations, fetchSuggestions, fetchStats, addOrganization, updateOrganization, toggleStatus, isLoading } = useOrgStore();

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            fetchSuggestions(query);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            fetchOrganizations(1, ''); // Reset table if cleared
        }
    };

    const handleSuggestionClick = (org: any) => {
        setSearchQuery(org.orgName);
        setShowSuggestions(false);
        fetchOrganizations(1, org.orgName);
    };


    // Action Menu State
    const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
    const [editingOrg, setEditingOrg] = useState<any | null>(null);

    // Disable Confirmation State
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [orgToDisable, setOrgToDisable] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        orgName: '',
        ownerName: '',
        email: '',
        mobileNumber: '',
    });

    useEffect(() => {
        fetchOrganizations();
        fetchStats();
    }, [fetchOrganizations, fetchStats]);

    // Mock Data -> Stats now come from store
    const statCards = [
        { label: 'Total Orgs', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
        { label: 'Active', value: stats.active, color: 'text-green-500', bg: 'bg-white/5' },
        { label: 'Disabled', value: stats.disabled, color: 'text-orange-500', bg: 'bg-white/5' },
        // { label: 'Total Users', value: '15,402', color: 'text-blue-500', bg: 'bg-white/5' },
    ];

    // Handle clicking outside to close menus
    const handleBackdropClick = () => {
        if (actionMenuOpenId !== null) setActionMenuOpenId(null);
    };

    const handleEdit = (org: any) => {
        setEditingOrg(org);
        setFormData({
            orgName: org.orgName,
            ownerName: org.ownerName,
            email: org.email,
            mobileNumber: org.mobileNumber || '',
        });
        setIsAddOrgModalOpen(true);
        setActionMenuOpenId(null);
    };

    const handleDisableClick = (org: any) => {
        setOrgToDisable(org);
        setIsDisableModalOpen(true);
        setActionMenuOpenId(null);
    };

    const confirmDisable = async () => {
        if (orgToDisable) {
            try {
                // The toggleStatus function in store now handles reading current state and toggling
                await toggleStatus(orgToDisable._id);
                toast.success(`Organization status updated successfully`);
                setIsDisableModalOpen(false);
                setOrgToDisable(null);
            } catch (error) {
                toast.error("Failed to update status");
            }
        }
    };

    const handleModalClose = () => {
        setIsAddOrgModalOpen(false);
        setEditingOrg(null);
        setFormData({ orgName: '', ownerName: '', email: '', mobileNumber: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingOrg) {
                await updateOrganization(editingOrg._id, formData);
                toast.success("Organization updated successfully");
            } else {
                await addOrganization(formData);
                toast.success("Organization created successfully");
            }
            handleModalClose();
        } catch (error) {
            toast.error(editingOrg ? "Failed to update organization" : "Failed to create organization");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-white font-sans overflow-hidden" onClick={handleBackdropClick}>
            {/* Navbar - Passing no-op for sidebar toggle since it's not needed here */}
            <Navbar setIsMobileMenuOpen={() => { }} />

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

                    {/* Header Section */}



                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Registered Organizations</h1>
                            <p className="text-slate-400 text-sm">Manage and monitor all active platform tenants.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statCards.map((stat, index) => (
                            <div key={index} className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 shadow-sm">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    {/* Search and Action Row */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 z-50">
                        {/* Search Bar with Suggestions */}
                        <div className="relative w-full md:w-96">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search org, owner, email..."
                                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    onFocus={() => {
                                        if (searchQuery) setShowSuggestions(true);
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => setShowSuggestions(false), 200);
                                    }}
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                                    {suggestions.length > 0 ? (
                                        <ul>
                                            {suggestions.map((org) => (
                                                <li
                                                    key={org._id}
                                                    onClick={() => handleSuggestionClick(org)}
                                                    className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-none transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-8 rounded-md ${org.avatarBg || 'bg-blue-600'} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                                                            {org.initials || org.orgName.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-sm font-medium text-white truncate">{org.orgName}</span>
                                                            <span className="text-xs text-slate-400 truncate">{org.ownerName} • {org.email}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                            No result found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => {
                                setEditingOrg(null);
                                setFormData({ orgName: '', ownerName: '', email: '', mobileNumber: '' });
                                setIsAddOrgModalOpen(true);
                            }}
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Add Organisation
                        </button>
                    </div>

                    <div className="bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shadow-sm h-[500px] flex flex-col">
                        <div className="overflow-auto flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
                                </div>
                            ) : (
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
                                            <tr key={org._id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center gap-3 ${!org.isEnabled ? 'opacity-50' : ''}`}>
                                                        <div className={`size-10 rounded-lg ${org.avatarBg || 'bg-blue-600'} flex items-center justify-center text-sm font-bold text-white`}>
                                                            {org.initials || org.orgName.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-white">{org.orgName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                                                    <span className={!org.isEnabled ? 'opacity-50' : ''}>{org.ownerName}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex flex-col ${!org.isEnabled ? 'opacity-50' : ''}`}>
                                                        <span className="text-sm text-white">{org.email}</span>
                                                        <span className="text-xs text-slate-500">{org.mobileNumber}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${org.isEnabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {org.isEnabled ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                                    <span className={!org.isEnabled ? 'opacity-50' : ''}>{org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActionMenuOpenId(actionMenuOpenId === org._id ? null : org._id);
                                                        }}
                                                        className={`text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors ${actionMenuOpenId === org._id ? 'text-white bg-slate-700' : ''}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                    </button>

                                                    {/* Action Menu Dropdown */}
                                                    {actionMenuOpenId === org._id && (
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
                                                                <span className="material-symbols-outlined text-[18px]">{org.isEnabled ? 'block' : 'check_circle'}</span>
                                                                {org.isEnabled ? 'Disable' : 'Enable'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        {/* Pagination Footer */}
                        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between shrink-0">
                            <p className="text-sm text-slate-400">
                                Showing {pagination?.startIndex || 0}-{pagination?.endIndex || 0} of {pagination?.total || 0} organizations
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchOrganizations(pagination ? pagination.page - 1 : 1)}
                                    disabled={!pagination || pagination.page === 1}
                                    className="px-3 py-1.5 text-sm border border-slate-700 rounded hover:bg-slate-800 text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded font-medium">
                                        {pagination?.page || 1}
                                    </button>
                                </div>
                                <button
                                    onClick={() => fetchOrganizations(pagination ? pagination.page + 1 : 1)}
                                    disabled={!pagination || pagination.page >= pagination.totalPages}
                                    className="px-3 py-1.5 text-sm border border-slate-700 rounded hover:bg-slate-800 text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
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
                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Organisation Name</label>
                                        <input
                                            name="orgName"
                                            value={formData.orgName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Enter organisation name"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Owner Name</label>
                                        <input
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Enter owner's full name"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            required
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
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                                        <input
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            required
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
                                        disabled={isLoading}
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : (editingOrg ? 'Save Changes' : 'Create Organisation')}
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
                            <div className={`mx-auto flex items-center justify-center size-12 rounded-full mb-4 ${orgToDisable.isEnabled ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                <span className="material-symbols-outlined text-[24px]">
                                    {orgToDisable.isEnabled ? 'block' : 'check_circle'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {orgToDisable.isEnabled ? 'Disable Organisation?' : 'Enable Organisation?'}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to {orgToDisable.isEnabled ? 'disable' : 'enable'} <span className="font-semibold text-white">{orgToDisable.orgName}</span>?
                                {orgToDisable.isEnabled ? ' This will prevent access to their dashboard.' : ' This will restore access to their dashboard.'}
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
                                    className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${orgToDisable.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
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
