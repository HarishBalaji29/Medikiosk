const statusStyles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-primary-500/10 text-primary-400 border-primary-500/30',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    online: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    offline: 'bg-dark-700/50 text-dark-400 border-dark-600/50',
}

const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    info: 'bg-primary-400',
    pending: 'bg-amber-400',
    online: 'bg-emerald-400',
    offline: 'bg-dark-500',
}

export default function StatusBadge({ status, label, showDot = true, className = '' }) {
    return (
        <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium
      rounded-full border ${statusStyles[status] || statusStyles.info} ${className}
    `}>
            {showDot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || dotColors.info} ${status === 'online' ? 'animate-pulse' : ''}`} />
            )}
            {label || status}
        </span>
    )
}
