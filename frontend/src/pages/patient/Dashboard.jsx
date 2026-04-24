import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { SkeletonCard, SkeletonRow } from '../../components/ui/Skeleton'
import api from '../../services/api'
import {
    ScanLine, Pill, Clock, Bell, TrendingUp,
    History, ChevronRight, Activity, Calendar,
    Inbox, Zap, Heart, ArrowRight, Star, Shield
} from 'lucide-react'

/* ── Animated count-up ── */
function CountUp({ target, duration = 1000 }) {
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (target === 0) { setVal(0); return }
        const start = performance.now()
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            setVal(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target, duration])
    return <span>{val}</span>
}

/* ── Health ring SVG ── */
function HealthRing({ percent = 0 }) {
    const r = 44, c = 2 * Math.PI * r
    const dash = (percent / 100) * c
    return (
        <svg width="110" height="110" viewBox="0 0 110 110" className="rotate-[-90deg]">
            <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="10" />
            <motion.circle
                cx="55" cy="55" r={r} fill="none"
                stroke="url(#ringGrad)" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: c - dash }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
            <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
            </defs>
        </svg>
    )
}

const timeGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return '🌅 Good Morning'
    if (h < 17) return '☀️ Good Afternoon'
    return '🌙 Good Evening'
}

const statusColors = {
    dispensed: 'border-l-emerald-500 bg-emerald-500/5',
    approved: 'border-l-emerald-500 bg-emerald-500/5',
    pending: 'border-l-amber-500 bg-amber-500/5',
    rejected: 'border-l-rose-500 bg-rose-500/5',
}

export default function PatientDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const [recentMedicines, setRecentMedicines] = useState([])
    const [stats, setStats] = useState({ totalPrescriptions: 0, dispensed: 0, pending: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                const response = await api.get('/patient/prescriptions')
                const prescriptions = response.data
                const total = prescriptions.length
                const dispensed = prescriptions.filter(p => p.status === 'dispensed').length
                const pending = prescriptions.filter(p => p.status === 'pending').length
                setStats({ totalPrescriptions: total, dispensed, pending })
                let history = []
                prescriptions.forEach(p => {
                    if (p.medicines && Array.isArray(p.medicines) && p.medicines.length > 0) {
                        p.medicines.forEach(m => {
                            history.push({
                                name: `${m.name} ${m.dosage || ''}`.trim(),
                                date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
                                status: p.status,
                                doctor: p.doctor_name,
                                qty: 1
                            })
                        })
                    }
                })
                setRecentMedicines(history.slice(0, 8))
                if (pending > 0) toast(`You have ${pending} prescription(s) pending review`, 'warning')
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
                toast('Could not load dashboard data', 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    const healthPercent = stats.totalPrescriptions > 0
        ? Math.round((stats.dispensed / stats.totalPrescriptions) * 100)
        : 0

    const statCards = [
        {
            label: 'Total Prescriptions', value: stats.totalPrescriptions,
            icon: Pill, color: 'text-primary-400', bg: 'bg-primary-500/10',
            border: 'border-primary-500/20', glow: 'hover:shadow-primary-500/10'
        },
        {
            label: 'Dispensed', value: stats.dispensed,
            icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20', glow: 'hover:shadow-emerald-500/10'
        },
        {
            label: 'Pending Review', value: stats.pending,
            icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10',
            border: 'border-amber-500/20', glow: 'hover:shadow-amber-500/10',
            pulse: stats.pending > 0
        },
    ]

    return (
        <AnimatedPage>
            {/* ── Hero Welcome ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-2xl overflow-hidden mb-6 p-6 lg:p-8"
                style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.10) 50%, rgba(16,185,129,0.08) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                }}
            >
                {/* Animated background dots */}
                <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-primary-400 mb-1">{timeGreeting()}</p>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                            {user?.name || 'Patient'} <span className="text-gradient">👋</span>
                        </h1>
                        <p className="text-dark-400 mb-4 text-sm">
                            Your health summary — <span className="text-white font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800/60 border border-dark-700/50 text-xs text-dark-300">
                                <Pill className="w-3 h-3 text-primary-400" /> {stats.totalPrescriptions} total
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                                <Activity className="w-3 h-3" /> {stats.dispensed} dispensed
                            </div>
                            {stats.pending > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 animate-pulse">
                                    <Clock className="w-3 h-3" /> {stats.pending} pending
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Health Ring */}
                    <div className="relative flex-shrink-0">
                        <HealthRing percent={healthPercent} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotate(0deg)' }}>
                            <span className="text-xl font-bold text-white">{healthPercent}%</span>
                            <span className="text-xs text-dark-400">done</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ── Scan CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="md:col-span-2 group cursor-pointer"
                    onClick={() => navigate('/patient/upload')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="relative rounded-2xl border border-primary-500/30 p-6 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))' }}>
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
                            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium">AI-Powered</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Scan New Prescription</h2>
                                <p className="text-dark-400 text-sm mb-4">Upload your prescription for instant AI analysis & dispensing</p>
                                <Button icon={ScanLine} iconRight={ChevronRight} size="lg">
                                    Start Scanning
                                </Button>
                            </div>
                            <motion.div
                                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="hidden md:flex w-24 h-24 rounded-2xl bg-primary-500/15 border border-primary-500/25 items-center justify-center"
                            >
                                <ScanLine className="w-12 h-12 text-primary-400" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Stat Cards ── */}
                {loading
                    ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    : statCards.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            whileHover={{ y: -3 }}
                        >
                            <div className={`rounded-2xl border p-5 ${stat.border} transition-all duration-300 hover:shadow-xl ${stat.glow} cursor-default`}
                                style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center ${stat.pulse ? 'animate-pulse' : ''}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            <CountUp target={stat.value} />
                                        </p>
                                        <p className="text-xs text-dark-400 mt-0.5">{stat.label}</p>
                                    </div>
                                </div>
                                {/* Mini sparkline bar */}
                                <div className="mt-3 h-1 rounded-full bg-dark-800 overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: stat.value > 0 ? `${Math.min((stat.value / Math.max(stats.totalPrescriptions, 1)) * 100, 100)}%` : '0%' }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))
                }

                {/* ── Medicine Timeline ── */}
                <div className="md:col-span-2">
                    <div className="rounded-2xl border border-dark-700/50 p-6"
                        style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-primary-400" />
                                Medicine Timeline
                            </h3>
                            <button
                                onClick={() => navigate('/patient/history')}
                                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                View all <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {Array(4).fill(0).map((_, i) => <SkeletonRow key={i} />)}
                            </div>
                        ) : recentMedicines.length > 0 ? (
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-dark-700/50" />
                                <div className="space-y-3 pl-2">
                                    {recentMedicines.map((med, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-l-2 ${statusColors[med.status] || 'border-l-dark-600 bg-dark-800/20'} ml-6`}
                                        >
                                            {/* Timeline dot */}
                                            <div className={`absolute left-[14px] w-2.5 h-2.5 rounded-full border-2 border-dark-900 ${med.status === 'dispensed' || med.status === 'approved' ? 'bg-emerald-400' : med.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`} />

                                            <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                                <Pill className="w-4 h-4 text-primary-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{med.name}</p>
                                                <p className="text-xs text-dark-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3" /> {med.date}
                                                    {med.doctor && <span className="ml-2 text-dark-500">· Dr. {med.doctor}</span>}
                                                </p>
                                            </div>
                                            <StatusBadge
                                                status={med.status === 'dispensed' || med.status === 'approved' ? 'success' : med.status === 'rejected' ? 'error' : 'pending'}
                                                label={med.status}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Inbox className="w-8 h-8 text-primary-400/50" />
                                </div>
                                <p className="text-sm text-dark-400 font-medium">No medicine history yet</p>
                                <p className="text-xs text-dark-500 mt-1">Upload a prescription to get started</p>
                                <Button size="sm" className="mt-4" icon={ScanLine} onClick={() => navigate('/patient/upload')}>
                                    Scan Now
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Notifications + Health Tips ── */}
                <div className="space-y-4">
                    {/* Notifications */}
                    <div className="rounded-2xl border border-dark-700/50 p-5"
                        style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}>
                        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                            <Bell className="w-4 h-4 text-amber-400" /> Alerts
                        </h3>
                        <div className="space-y-3">
                            {stats.pending > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Prescription Pending</p>
                                        <p className="text-xs text-dark-400 mt-0.5">{stats.pending} awaiting doctor review</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">All clear!</p>
                                        <p className="text-xs text-dark-400 mt-0.5">No pending prescriptions</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Health tip card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="rounded-2xl border border-primary-500/20 p-5"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-rose-400" />
                            <span className="text-xs font-semibold text-dark-300 uppercase tracking-wide">Health Tip</span>
                        </div>
                        <p className="text-sm text-dark-300 leading-relaxed">
                            💧 Remember to drink plenty of water with your medications for better absorption.
                        </p>
                    </motion.div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: 'History', icon: History, path: '/patient/history', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
                            { label: 'Profile', icon: Star, path: '/patient/profile', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                        ].map(a => (
                            <motion.button
                                key={a.label}
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                onClick={() => navigate(a.path)}
                                className={`p-3 rounded-xl border ${a.bg} flex flex-col items-center gap-1.5 transition-all`}
                            >
                                <a.icon className={`w-5 h-5 ${a.color}`} />
                                <span className="text-xs font-medium text-dark-300">{a.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    )
}
