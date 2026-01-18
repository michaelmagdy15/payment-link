import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon, error, className = '', ...props }, ref) => {
        return (
            <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              block w-full px-3 py-2.5 
              bg-white border rounded-md
              text-slate-900 placeholder-slate-400
              shadow-sm
              focus:outline-none focus:ring-1
              transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-slate-200 focus:border-stripe-blurple focus:ring-stripe-blurple'
                            }
              ${className}
            `}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-stripe-blurple transition-colors">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-600 animate-in slide-in-from-top-1 duration-200">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
