import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}
const styles = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    error: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    info: 'border-primary-500/40 bg-primary-500/10 text-primary-400',
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const toast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => {
                        const Icon = icons[t.type]
                        return (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[280px] max-w-[380px] ${styles[t.type]}`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-medium flex-1 text-white">{t.message}</p>
                                <button
                                    onClick={() => remove(t.id)}
                                    className="p-0.5 rounded hover:opacity-70 transition-opacity flex-shrink-0"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx.toast
}
