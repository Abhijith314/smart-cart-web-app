import React, { useState, useEffect } from 'react';
import { LogOut, Loader, User, Eye, Search } from 'lucide-react';
import Invoice from './Invoice';

const Dashboard = ({ session, onLogout, supabase }) => {
    const [view, setView] = useState('home');
    const [bills, setBillsData] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            // 1. Get user profile
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', session.user.email)
                .single();

            if (userData) {
                setUserProfile(userData);
                // 2. Fetch bills
                const { data: billsData, error: billsError } = await supabase
                    .from('billing')
                    .select('*')
                    .eq('user_id', userData.id)
                    .order('created_at', { ascending: false });

                if (billsData) {
                    setBillsData(billsData);
                } else {
                    console.error("Failed to fetch bills", billsError);
                }
            } else {
                console.error("User not found", userError);
            }
            setLoading(false);
        };

        if (session?.user?.email) {
            fetchUserData();
        }
    }, [session, supabase]);

    const handleOpenInvoice = (id) => {
        setSelectedBillId(id);
        setView('invoice');
    };

    const filteredBills = bills.filter(bill =>
        bill.bill_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    if (view === 'invoice') {
        return <Invoice billId={selectedBillId} onBack={() => setView('home')} supabase={supabase} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col font-sans text-white">
            {/* Header */}
            <header className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Welcome Back</div>
                            <div className="font-bold text-lg leading-tight">
                                {userProfile?.username || session.user.email.split('@')[0]}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
                    >
                        <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {loading ? (
                    <div className="flex h-64 justify-center items-center text-indigo-400">
                        <Loader className="animate-spin h-10 w-10" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold text-white">Purchase History</h2>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Invoice ID..."
                                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-full sm:w-64 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Responsive Table Card */}
                        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="bg-gray-750 text-xs uppercase bg-gray-900/50 text-gray-400 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Invoice ID</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-center">Items</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-center">View bill</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filteredBills.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    No purchase history found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredBills.map((bill) => (
                                                <tr key={bill.bill_id} className="hover:bg-gray-700/30 transition-colors group">
                                                    <td className="px-6 py-4 font-medium text-white font-mono">
                                                        #{bill.bill_id?.slice(0, 8)}...
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(bill.created_at).toLocaleDateString()}
                                                        <span className="block text-xs text-gray-500">
                                                            {new Date(bill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {Array.isArray(bill.purchase_items) ? bill.purchase_items.length : 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-emerald-400">
                                                        {formatCurrency(bill.grand_total)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bill.payment_status === 'Paid'
                                                                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900'
                                                                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                                            }`}>
                                                            {bill.payment_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleOpenInvoice(bill.bill_id)}
                                                            className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                                                            title="View Bill"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View (Visible only on very small screens if table breaks, but overflow-x handles it mostly. 
                    For better UX on mobile, we can add a mobile-only card list below and hide table on small screens if requested. 
                    For now, overflow-x is standard for tables.) 
                */}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
