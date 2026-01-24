import React from 'react';
import { ArrowLeft } from 'lucide-react';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const BillList = ({ bills, onSelectBill, onBack }) => {
    return (
        <div className="h-full flex flex-col bg-gray-900 text-white p-6">
            <button
                onClick={onBack}
                className="self-start flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 transition-colors"
            >
                <ArrowLeft size={18} /> <span className="text-lg font-medium">Back to Dashboard</span>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-100">Your Purchase History</h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bills.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-lg">No bills found.</p>
                        </div>
                    ) : (
                        bills.map(bill => (
                            <div
                                key={bill.bill_id}
                                onClick={() => onSelectBill(bill.bill_id)}
                                className="group relative bg-gray-800 p-6 rounded-xl border border-gray-700 cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                                            #{bill.bill_id?.slice(0, 8)}...
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            {new Date(bill.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-semibold ${bill.payment_status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                        {bill.payment_status}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Total Amount</span>
                                    <span className="text-xl font-bold text-green-400">
                                        {formatCurrency(bill.grand_total)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillList;
