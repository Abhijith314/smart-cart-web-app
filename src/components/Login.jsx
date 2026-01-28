import React, { useState } from 'react';
import { Loader } from 'lucide-react';

const Login = ({ onLogin, supabase }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setOtpSent(true);
            setMessage('OTP sent to your email!');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email',
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
            setLoading(false);
        } else {
            // Session established
            // Parent will detect session change
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-center text-white">
                        Smart Cart Login
                    </h2>
                    <p className="mt-2 text-sm text-center text-gray-400">
                        Sign in to access your dashboard
                    </p>
                </div>

                {!otpSent ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label htmlFor="otp" className="sr-only">
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700 text-center tracking-[0.5em] text-xl"
                                placeholder="123456"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200"
                            >
                                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Back to Email
                            </button>
                        </div>
                    </form>
                )}

                {message && (
                    <div className={`mt-4 text-center text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
