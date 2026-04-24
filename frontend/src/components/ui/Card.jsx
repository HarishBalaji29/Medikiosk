import { motion } from 'framer-motion'

const cardVariants = {
    default: 'bg-white/80 dark:bg-dark-900/60 border-slate-200 dark:border-dark-700/50',
    glass: 'bg-white/60 dark:bg-dark-900/40 border-slate-200 dark:border-dark-700/30 backdrop-blur-xl',
    gradient: 'border-slate-200 dark:border-dark-700/50',
    accent: 'bg-white/80 dark:bg-dark-900/60 border-primary-500/30',
    emerald: 'bg-white/80 dark:bg-dark-900/60 border-emerald-500/30',
}

export default function Card({
    children,
    variant = 'default',
    span = 1,
    rowSpan = 1,
    hover = true,
    glow,
    className = '',
    onClick,
    ...props
}) {
    const spanClass = span === 2 ? 'md:col-span-2' : span === 3 ? 'md:col-span-3' : ''
    const rowSpanClass = rowSpan === 2 ? 'md:row-span-2' : ''
    const glowClass = glow === 'blue' ? 'hover:shadow-primary-500/10' : glow === 'emerald' ? 'hover:shadow-emerald-500/10' : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -2, borderColor: 'rgba(59, 130, 246, 0.3)' } : {}}
            transition={{ duration: 0.3 }}
            className={`
        relative overflow-hidden rounded-2xl border p-6
        backdrop-blur-sm transition-all duration-300
        ${cardVariants[variant]}
        ${spanClass} ${rowSpanClass}
        ${hover ? 'cursor-pointer hover:shadow-xl' : ''}
        ${glowClass}
        ${className}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    )
}
