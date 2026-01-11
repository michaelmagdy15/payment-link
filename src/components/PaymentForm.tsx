import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Globe, ChevronDown, ArrowRight, Wallet } from 'lucide-react';
import { Input } from './Input';

export const PaymentForm = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'google_pay'>('card');
    const [formData, setFormData] = useState({
        email: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: '',
        country: 'Cyprus',
        saveInfo: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful</h2>
                <p className="text-slate-500 mb-8">
                    We've sent a receipt to {formData.email}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto w-full p-8 lg:p-12 h-full overflow-y-auto">

            {/* Pay with Link Button */}
            <button className="w-full flex justify-center items-center py-3 bg-[#00D924] hover:bg-[#00c920] text-black font-semibold rounded-[4px] mb-6 transition-colors shadow-sm">
                Pay with <span className="font-bold ml-1 flex items-center">
                    <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-[1px]">&gt;</span>
                    Link
                </span>
            </button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-slate-400">OR</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Contact information</h3>
                    <Input
                        label=""
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-[4px] border-slate-300 shadow-sm"
                    />
                </div>

                {/* Payment Method */}
                <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Payment method</h3>

                    <div className="border border-slate-200 rounded-[4px] p-1 bg-slate-50 flex mb-4 space-x-1">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-1.5 px-3 rounded text-sm font-medium text-slate-700 flex items-center justify-center shadow-sm border ${paymentMethod === 'card' ? 'bg-white border-slate-200' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'}`}
                        >
                            <CreditCard className="w-4 h-4 mr-2" /> Card
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('google_pay')}
                            className={`flex-1 py-1.5 px-3 rounded text-sm font-medium text-slate-700 flex items-center justify-center border ${paymentMethod === 'google_pay' ? 'bg-white border-slate-200 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'}`}
                        >
                            <Wallet className="w-4 h-4 mr-2" /> Google Pay
                        </button>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="space-y-4">
                            {/* Card Container Box */}
                            <div className="border border-slate-200 rounded-[4px] p-4 bg-white relative">
                                {/* Radio selected indicator */}
                                <div className="absolute top-4 left-4">
                                    <div className="w-4 h-4 border-[5px] border-black rounded-full"></div>
                                </div>
                                <div className="ml-8 flex items-center font-medium text-slate-900 mb-4">
                                    <CreditCard className="w-4 h-4 mr-2" /> Card
                                </div>

                                <div className="space-y-3 ml-8"> {/* Indent content */}
                                    <div className="border border-slate-200 rounded-[4px] overflow-hidden">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="1234 1234 1234 1234"
                                                className="w-full px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 border-b border-slate-200"
                                                onChange={handleChange}
                                                required
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                                                <div className="w-8 h-5 bg-blue-900 rounded flex items-center justify-center text-[8px] text-white font-bold tracking-tighter">VISA</div>
                                                <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                                            </div>
                                        </div>
                                        <div className="flex divide-x divide-slate-200">
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM / YY"
                                                className="w-1/2 px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400"
                                                onChange={handleChange}
                                                required
                                            />
                                            <div className="relative w-1/2">
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    placeholder="CVC"
                                                    className="w-full px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 pr-10"
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Cardholder name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full name on card"
                                            className="w-full px-3 py-2.5 rounded-[4px] border border-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Country or region</label>
                                        <div className="relative">
                                            <select
                                                name="country"
                                                className="w-full px-3 py-2.5 rounded-[4px] border border-slate-200 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                                                value={formData.country}
                                                onChange={handleChange}
                                            >
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="US">United States</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Google Pay Option Placeholder */}
                    <div className="mt-3 border border-slate-200 rounded-[4px] p-4 bg-white flex items-center">
                        <div className="w-4 h-4 border border-slate-300 rounded-full mr-4"></div>
                        <div className="flex items-center text-slate-700 font-medium">
                            <Wallet className="w-4 h-4 mr-2 text-slate-500" /> Google Pay
                        </div>
                    </div>
                </div>

                {/* Save Info Checkbox */}
                <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4 flex items-start">
                    <input
                        type="checkbox"
                        name="saveInfo"
                        id="saveInfo"
                        className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        onChange={handleChange}
                    />
                    <div className="ml-3">
                        <label htmlFor="saveInfo" className="text-sm font-medium text-slate-900 block">Save my information for faster checkout</label>
                        <p className="text-xs text-slate-500 mt-1">
                            Pay securely at Mobile APP and everywhere Link is accepted.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className={`
            w-full flex justify-center items-center py-3 px-4 rounded-[4px] shadow-sm text-base font-medium text-white 
            bg-[#0074E4] hover:bg-[#0063c4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed
          `}
                >
                    {isProcessing ? 'Processing...' : 'Pay AED 100.00'}
                </button>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center text-xs text-slate-400">
                    <span className="mr-4">Powered by <span className="font-bold text-slate-500">stripe</span></span>
                    <span className="border-l border-slate-200 pl-4 mr-4">Terms</span>
                    <span>Privacy</span>
                </div>
            </form>
        </div>
    );
};
