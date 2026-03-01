import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-dark-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                )}
                <input
                    ref={ref}
                    className={`
            w-full bg-dark-900/60 border border-dark-700 rounded-xl
            px-4 py-3 text-sm text-white placeholder-dark-500
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/50' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-rose-400 mt-1">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input
