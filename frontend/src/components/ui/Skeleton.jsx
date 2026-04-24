// Skeleton shimmer loading components
export function SkeletonLine({ className = '' }) {
    return (
        <div className={`animate-pulse bg-dark-800 rounded-lg ${className}`} />
    )
}

export function SkeletonCard({ className = '' }) {
    return (
        <div className={`rounded-2xl border border-dark-700/50 bg-dark-900/60 p-6 ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-dark-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <SkeletonLine className="h-4 w-1/2" />
                    <SkeletonLine className="h-3 w-1/3" />
                </div>
            </div>
            <SkeletonLine className="h-8 w-1/4 mb-2" />
            <SkeletonLine className="h-3 w-2/3" />
        </div>
    )
}

export function SkeletonRow({ className = '' }) {
    return (
        <div className={`flex items-center gap-4 p-4 border-b border-dark-700/30 ${className}`}>
            <div className="w-9 h-9 rounded-full bg-dark-800 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <SkeletonLine className="h-3.5 w-1/3" />
                <SkeletonLine className="h-2.5 w-1/4" />
            </div>
            <SkeletonLine className="h-6 w-16 rounded-full" />
        </div>
    )
}

export function SkeletonGrid({ count = 4, className = '' }) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {Array(count).fill(0).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

// Count-up number animation hook helper
export function useCountUp(target, duration = 1200) {
    // Returns the animated value — use with useState + useEffect
    return target
}
