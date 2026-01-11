import { useState } from 'react';

export const ProductSummary = () => {
    const [currency, setCurrency] = useState<'EUR' | 'AED'>('AED');

    return (
        <div className="h-full flex flex-col p-8 lg:p-12 relative overflow-hidden bg-white text-slate-900 border-r border-slate-100">

            <div className="relative z-10 max-w-md mx-auto w-full">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mb-12">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-gradient-to-tr from-blue-500 to-green-400 rounded-sm"></div>
                    </div>
                    <span>Mobile APP</span>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Choose a currency:</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setCurrency('EUR')}
                            className={`
                        flex items-center justify-center px-4 py-3 rounded-md border text-sm font-semibold transition-all
                        ${currency === 'EUR'
                                    ? 'border-indigo-600 ring-1 ring-indigo-600 bg-white text-slate-900'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }
                    `}
                        >
                            <span className="mr-2">🇪🇺</span> €24.32
                        </button>
                        <button
                            onClick={() => setCurrency('AED')}
                            className={`
                        flex items-center justify-center px-4 py-3 rounded-md border text-sm font-semibold transition-all
                        ${currency === 'AED'
                                    ? 'border-indigo-600 ring-1 ring-indigo-600 bg-white text-slate-900'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }
                    `}
                        >
                            <span className="mr-2">🇦🇪</span> AED 100.00
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">1 AED = 0.2432 EUR</p>
                </div>

                <div className="space-y-4 pt-8">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-900">Mobile APP</span>
                        <span className="text-slate-900">{currency === 'AED' ? 'AED 100.00' : '€24.32'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
