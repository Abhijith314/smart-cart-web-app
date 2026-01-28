import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

// Use same formatting helper
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const Invoice = ({ billId, onBack, supabase }) => {
    const [loading, setLoading] = useState(true);
    const [bill, setBill] = useState(null);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchBill = async () => {
            if (!billId) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('billing')
                .select('*')
                .eq('bill_id', billId)
                .single();

            if (error) {
                setError(error.message);
            } else {
                // Parse items if string
                if (typeof data.purchase_items === 'string') {
                    try {
                        data.purchase_items = JSON.parse(data.purchase_items);
                    } catch (e) {
                        console.error("Failed to parse items", e);
                        data.purchase_items = [];
                    }
                }
                setBill(data);
                // 2. Fetch user profile
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user_id)
                    .single();

                if (userData) {
                    setUserProfile(userData);
                } else {
                console.error("User not found", userError);
                }
            }
            setLoading(false);
        };
        const fetchUserData = async () => {
            setLoading(true);
            // 1. Get user profile
            
        };

        fetchBill();
        fetchUserData();
    }, [billId, supabase]);

    if (loading) return <div className="flex items-center justify-center h-full text-white min-h-[50vh]">Loading Invoice...</div>;
    if (error) return (
        <div className="flex flex-col items-center justify-center h-full text-white min-h-[50vh] gap-4">
            <h3 className="text-xl font-bold text-red-400">Error</h3>
            <p>{error}</p>
            <button onClick={onBack} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Back</button>
        </div>
    );
    if (!bill) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800">

            {/* Sticky Header for Invoice View */}
            <div className="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} /> {onBack ? "Back" : "Home"}
                </button>
                <span className="font-bold text-gray-600 truncate ml-4">Viewing Invoice: {billId}</span>
            </div>

            {/* Scrollable Invoice Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-100">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 border-gray-100 pb-6 gap-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Smart Cart Store</h1>
                            <p className="mt-2 text-sm text-gray-500">123 Tech Avenue</p>
                        </div>
                        <div className="text-left md:text-right">
                            <h2 className="text-xl font-bold text-gray-600 tracking-widest uppercase">INVOICE</h2>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p><span className="font-semibold">Date:</span> {new Date(bill.created_at).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Status:</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{bill.payment_status}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                        <p className="font-medium text-gray-800">User name: {userProfile.username}</p>
                        <p className="font-medium text-gray-800">User ID: {bill.user_id}</p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                                    <th className="px-4 py-3 border-b font-medium">#</th>
                                    <th className="px-4 py-3 border-b font-medium">Item Description</th>
                                    <th className="px-4 py-3 border-b font-medium text-center">Qty</th>
                                    <th className="px-4 py-3 border-b font-medium text-right">Price</th>
                                    <th className="px-4 py-3 border-b font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bill.purchase_items?.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.name || item.desc}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">{item.quantity || item.qty}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency((item.price) * (item.quantity || item.qty))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="mt-8 flex flex-col items-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-6 rounded-lg">
                            <div className="flex justify-between py-2 border-b border-gray-200 text-sm text-gray-600">
                                <span>Subtotal:</span>
                                <span className="font-medium">{formatCurrency(bill.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 text-sm text-gray-600">
                                <span>You saved:</span>
                                <span className="font-medium">{formatCurrency(bill.total_discount || 0)}</span>
                            </div>
                            <div className="flex justify-between py-3 text-lg font-bold text-gray-900 border-t-2 border-gray-800 mt-2">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(bill.grand_total)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 items-center text-center">
                        Thank you for the shopping! Visit again soon!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
