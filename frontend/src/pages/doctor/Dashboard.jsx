import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import {
    FileText, Clock, CheckCircle2, XCircle, Eye,
    Pill, User, Calendar, TrendingUp, AlertCircle,
    Inbox, Loader2, Stethoscope, ChevronDown, ChevronUp,
    MessageSquare, Activity, Zap
} from 'lucide-react'
import api from '../../services/api'

/* ── Animated Donut Chart ── */
function DonutChart({ pending, approved, rejected }) {
    const total = pending + approved + rejected || 1
    const r = 40, circumference = 2 * Math.PI * r
    const segs = [
        { val: approved, color: '#10B981', label: 'Approved' },
        { val: pending, color: '#F59E0B', label: 'Pending' },
        { val: rejected, color: '#F43F5E', label: 'Rejected' },
    ]
    let offset = 0
    const arcs = segs.map(s => {
        const len = (s.val / total) * circumference
        const arc = { ...s, offset, len }
        offset += len
        return arc
    })

    return (
        <div className="flex items-center gap-6">
            <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    {arcs.map((arc, i) => (
                        <motion.circle
                            key={i}
                            cx="50" cy="50" r={r}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth="14"
                            strokeLinecap="butt"
                            strokeDasharray={`${arc.len} ${circumference - arc.len}`}
                            strokeDashoffset={-arc.offset}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                            transform="rotate(-90 50 50)"
                        />
                    ))}
                    {/* Background ring */}
                    <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-white">{total}</span>
                    <span className="text-[9px] text-dark-400">total</span>
                </div>
            </div>
            <div className="space-y-2">
                {segs.map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-xs text-dark-400">{s.label}</span>
                        <span className="text-xs font-semibold text-white ml-auto pl-4">{s.val}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── Medicine Chip ── */
function MedChip({ med }) {
    const colors = ['bg-blue-500/10 border-blue-500/30 text-blue-400', 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', 'bg-purple-500/10 border-purple-500/30 text-purple-400', 'bg-amber-500/10 border-amber-500/30 text-amber-400']
    const c = colors[med.name.charCodeAt(0) % colors.length]
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${c}`}>
            <Pill className="w-3 h-3" /> {med.name} {med.dosage && <span className="opacity-70">· {med.dosage}</span>}
        </span>
    )
}

/* ── Prescription Card (expandable) ── */
function PrescriptionCard({ rx, onAction }) {
    const [expanded, setExpanded] = useState(false)
    const [note, setNote] = useState('')
    const [acting, setActing] = useState(false)

    const handleAction = async (status) => {
        setActing(true)
        await onAction(rx.id, status, note)
        setActing(false)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-dark-700/50 bg-dark-900/60 overflow-hidden hover:border-dark-600/60 transition-all"
        >
            {/* Card header */}
            <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-dark-800/30 transition-colors"
                onClick={() => setExpanded(e => !e)}
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold text-white uppercase flex-shrink-0">
                    {(rx.patient_name || 'P').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm truncate">{rx.patient_name || 'Patient'}</h4>
                        {rx.age && <span className="text-xs text-dark-500 hidden sm:block">Age {rx.age}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-dark-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        {rx.medicines?.length > 0 && (
                            <span className="text-xs text-dark-500">· {rx.medicines.length} med{rx.medicines.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {rx.confidence_score && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rx.confidence_score > 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {rx.confidence_score}%
                        </span>
                    )}
                    {expanded ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                </div>
            </div>

            {/* Expanded body */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0 border-t border-dark-700/40">
                            {/* Medicine chips */}
                            {rx.medicines?.length > 0 && (
                                <div className="mt-3 mb-3">
                                    <p className="text-xs font-medium text-dark-400 mb-2 flex items-center gap-1">
                                        <Pill className="w-3 h-3" /> Medicines Prescribed
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {rx.medicines.map((med, mi) => (
                                            <MedChip key={mi} med={med} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Confidence bar */}
                            {rx.confidence_score && (
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-dark-400">AI Confidence</span>
                                        <span className={rx.confidence_score > 80 ? 'text-emerald-400' : 'text-amber-400'}>{rx.confidence_score}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-dark-800 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${rx.confidence_score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${rx.confidence_score}%` }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Doctor note */}
                            {rx.status === 'pending' && (
                                <div className="mb-3">
                                    <label className="text-xs font-medium text-dark-400 flex items-center gap-1 mb-1">
                                        <MessageSquare className="w-3 h-3" /> Add Note (optional)
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        placeholder="e.g. Reduce dosage, take with food..."
                                        rows={2}
                                        className="w-full bg-dark-800/60 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white placeholder-dark-500 outline-none focus:border-primary-500 resize-none"
                                    />
                                </div>
                            )}

                            {/* Action buttons */}
                            {rx.status === 'pending' && (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAction('approved')}
                                        disabled={acting}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all disabled:opacity-50"
                                    >
                                        {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Approve
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAction('rejected')}
                                        disabled={acting}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium transition-all disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

/* ── Kanban Column ── */
function KanbanColumn({ title, count, cards, color, borderColor, icon: Icon, onAction, loading }) {
    return (
        <div className="flex-1 min-w-0">
            {/* Column header */}
            <div className={`flex items-center justify-between mb-3 px-1`}>
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-sm font-semibold text-white">{title}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${borderColor}`}>{count}</span>
            </div>
            {/* Column body */}
            <div className={`rounded-2xl border-2 ${borderColor.replace('text-', 'border-').replace('/10', '/20')} min-h-[200px] p-3 space-y-3`}
                style={{ background: 'rgba(18,18,22,0.5)' }}>
                {loading ? (
                    <div className="space-y-3">
                        {Array(2).fill(0).map((_, i) => (
                            <div key={i} className="h-20 rounded-xl bg-dark-800 animate-pulse" />
                        ))}
                    </div>
                ) : cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Inbox className="w-8 h-8 text-dark-600 mb-2" />
                        <p className="text-xs text-dark-500">No {title.toLowerCase()} prescriptions</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {cards.map(rx => (
                            <PrescriptionCard key={rx.id} rx={rx} onAction={onAction} />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

export default function DoctorDashboard() {
    const { user } = useAuth()
    const toast = useToast()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchPrescriptions() }, [])

    const fetchPrescriptions = async () => {
        try {
            setLoading(true)
            const res = await api.get('/doctor/prescriptions')
            setItems(res.data)
        } catch (error) {
            console.error('Failed to fetch prescriptions:', error)
            toast('Failed to load prescriptions', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id, status, note) => {
        try {
            setItems(prev => prev.map(p => p.id === id ? { ...p, status } : p))
            const action = status === 'approved' ? 'approve' : 'reject'
            await api.post(`/doctor/prescriptions/${id}/${action}`)
            toast(
                status === 'approved' ? '✅ Prescription approved!' : '❌ Prescription rejected',
                status === 'approved' ? 'success' : 'error'
            )
        } catch (error) {
            console.error(`Failed to ${status}:`, error)
            toast('Action failed. Please try again.', 'error')
            fetchPrescriptions()
        }
    }

    const pending = items.filter(p => p.status === 'pending')
    const approved = items.filter(p => p.status === 'approved')
    const rejected = items.filter(p => p.status === 'rejected')

    const stats = [
        { label: 'Pending', value: pending.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', pulse: pending.length > 0 },
        { label: 'Approved', value: approved.length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Rejected', value: rejected.length, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        { label: 'Total', value: items.length, icon: TrendingUp, color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
    ]

    return (
        <AnimatedPage>
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">On Duty</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Dr. <span className="text-gradient">{user?.name || 'Doctor'}</span>
                    </h1>
                    <p className="text-dark-400 text-sm mt-0.5">{user?.specialization || 'Review and manage patient prescriptions'}</p>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchPrescriptions() }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-white text-sm transition-colors hover:border-dark-600"
                >
                    <Activity className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-xl border ${stat.border} p-4 flex items-center gap-3 ${stat.pulse ? 'animate-pulse' : ''}`}
                        style={{ background: 'rgba(24,24,27,0.8)' }}
                    >
                        <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{loading ? '—' : stat.value}</p>
                            <p className="text-xs text-dark-400">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Analytics row ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl border border-dark-700/50 p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}
            >
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary-400" /> Prescription Analytics
                    </h3>
                    <p className="text-xs text-dark-400">Real-time approval ratio</p>
                </div>
                {!loading && <DonutChart pending={pending.length} approved={approved.length} rejected={rejected.length} />}
            </motion.div>

            {/* ── Kanban Board ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-400" /> Prescription Queue
                </h2>
                <div className="flex flex-col lg:flex-row gap-4">
                    <KanbanColumn
                        title="Pending" count={pending.length} cards={pending}
                        color="text-amber-400" borderColor="text-amber-500/10 border-amber-500/30"
                        icon={Clock} onAction={handleAction} loading={loading}
                    />
                    <KanbanColumn
                        title="Approved" count={approved.length} cards={approved}
                        color="text-emerald-400" borderColor="text-emerald-500/10 border-emerald-500/30"
                        icon={CheckCircle2} onAction={handleAction} loading={loading}
                    />
                    <KanbanColumn
                        title="Rejected" count={rejected.length} cards={rejected}
                        color="text-rose-400" borderColor="text-rose-500/10 border-rose-500/30"
                        icon={XCircle} onAction={handleAction} loading={loading}
                    />
                </div>
            </motion.div>
        </AnimatedPage>
    )
}
