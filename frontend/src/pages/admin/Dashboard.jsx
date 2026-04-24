import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import {
    Package, Monitor, Users, AlertTriangle, TrendingUp,
    Activity, Pill, Plus, BarChart3, Clock, Inbox,
    Cpu, Wifi, WifiOff, RefreshCw, Command, Search,
    X, ChevronRight, ArrowUpRight, Zap
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

/* ── Animated bar chart ── */
function HourlyChart({ data }) {
    const max = Math.max(...data, 1)
    const now = new Date().getHours()
    return (
        <div className="flex items-end gap-0.5 h-28">
            {data.map((val, i) => {
                const pct = (val / max) * 100
                const isNow = i === now
                return (
                    <motion.div
                        key={i}
                        title={`${i}:00 — ${val} dispensed`}
                        className={`flex-1 rounded-t cursor-pointer transition-all duration-200 group relative ${isNow ? 'bg-primary-500' : 'bg-dark-700 hover:bg-dark-600'}`}
                        initial={{ height: '2%' }}
                        animate={{ height: `${Math.max(pct, 2)}%` }}
                        transition={{ delay: 0.5 + i * 0.025, duration: 0.5, ease: 'easeOut' }}
                        style={isNow ? { boxShadow: '0 0 12px rgba(59,130,246,0.5)' } : {}}
                    >
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                            <div className="bg-dark-800 border border-dark-700 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap shadow-xl">
                                {i}:00 · {val}
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

/* ── Machine Health Tile ── */
function MachineTile({ machine }) {
    const isOnline = machine.status === 'active' || machine.status === 'online'
    const stockPct = machine.stockPct ?? 70
    const stockColor = stockPct > 60 ? '#10B981' : stockPct > 30 ? '#F59E0B' : '#F43F5E'

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className={`rounded-xl border p-4 cursor-pointer transition-all duration-300 ${isOnline ? 'border-emerald-500/30 hover:border-emerald-500/50' : 'border-rose-500/30 hover:border-rose-500/50'}`}
            style={{
                background: isOnline
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(24,24,27,0.8))'
                    : 'linear-gradient(135deg, rgba(244,63,94,0.06), rgba(24,24,27,0.8))',
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOnline ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                    {isOnline
                        ? <Wifi className="w-4 h-4 text-emerald-400" />
                        : <WifiOff className="w-4 h-4 text-rose-400" />
                    }
                </div>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            </div>
            <p className="text-sm font-semibold text-white truncate">{machine.name || `Machine ${machine.id}`}</p>
            <p className="text-xs text-dark-500 mb-2 truncate">{machine.location || 'No location'}</p>
            {/* Stock bar */}
            <div className="h-1 rounded-full bg-dark-800 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: stockColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            <p className="text-[10px] text-dark-500 mt-1">{stockPct}% stock</p>
        </motion.div>
    )
}

/* ── Command Palette ── */
function CommandPalette({ onClose, navigate }) {
    const [q, setQ] = useState('')
    const commands = [
        { label: 'Manage Inventory', icon: Package, path: '/admin/inventory', desc: 'Add, edit medicines' },
        { label: 'View Machines', icon: Monitor, path: '/admin/machines', desc: 'Machine status' },
        { label: 'Manage Users', icon: Users, path: '/admin/users', desc: 'Patients & doctors' },
        { label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard', desc: 'System overview' },
    ]
    const filtered = commands.filter(c =>
        c.label.toLowerCase().includes(q.toLowerCase()) ||
        c.desc.toLowerCase().includes(q.toLowerCase())
    )

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-lg rounded-2xl border border-dark-700 overflow-hidden shadow-2xl"
                style={{ background: '#0D0D12' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-700">
                    <Search className="w-4 h-4 text-dark-400 flex-shrink-0" />
                    <input
                        autoFocus
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-dark-500"
                        placeholder="Search commands..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                    <button onClick={onClose}><X className="w-4 h-4 text-dark-500 hover:text-white" /></button>
                </div>
                <div className="py-2 max-h-72 overflow-y-auto">
                    {filtered.map((cmd, i) => (
                        <motion.button
                            key={cmd.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => { navigate(cmd.path); onClose() }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-800 transition-colors text-left group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                <cmd.icon className="w-4 h-4 text-primary-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{cmd.label}</p>
                                <p className="text-xs text-dark-500">{cmd.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-dark-600 group-hover:text-dark-400" />
                        </motion.button>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-dark-500 text-sm">No commands found</div>
                    )}
                </div>
                <div className="px-4 py-2 border-t border-dark-800 flex items-center gap-4 text-xs text-dark-600">
                    <span>↵ Open</span><span>ESC Close</span>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const toast = useToast()
    const [statsData, setStatsData] = useState(null)
    const [machines, setMachines] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPalette, setShowPalette] = useState(false)
    const [hourlyData] = useState(() => {
        // Simulated hourly data — replace with real API when available
        const now = new Date().getHours()
        return Array(24).fill(0).map((_, i) => {
            if (i > now) return 0
            const base = i >= 8 && i <= 20 ? Math.floor(Math.random() * 12) + 2 : Math.floor(Math.random() * 3)
            return base
        })
    })

    useEffect(() => {
        fetchAll()
        // Ctrl+K shortcut
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setShowPalette(v => !v)
            }
            if (e.key === 'Escape') setShowPalette(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    const fetchAll = async () => {
        try {
            setLoading(true)
            const [statsRes, machinesRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/machines').catch(() => ({ data: [] }))
            ])
            setStatsData(statsRes.data)
            setMachines(machinesRes.data || [])
        } catch (error) {
            console.error('Failed to fetch admin stats:', error)
            toast('Could not load dashboard data', 'error')
        } finally {
            setLoading(false)
        }
    }

    const statsConfig = [
        {
            label: 'Total Users', value: statsData?.total_users || 0,
            icon: Users, gradient: 'from-primary-500 to-blue-600',
            sub: `${statsData?.total_patients || 0} patients · ${statsData?.total_doctors || 0} doctors`
        },
        {
            label: 'Active Machines', value: statsData?.active_machines || 0,
            icon: Monitor, gradient: 'from-emerald-500 to-green-600',
            sub: 'Online & dispensing'
        },
        {
            label: 'Low Stock Items', value: statsData?.low_stock_count || 0,
            icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600',
            sub: statsData?.low_stock_count > 0 ? '⚠️ Action needed' : 'All stocked up',
            alert: statsData?.low_stock_count > 0
        },
        {
            label: "Today's Dispensing", value: statsData?.dispensed_today || 0,
            icon: Activity, gradient: 'from-purple-500 to-violet-600',
            sub: 'Prescriptions filled today'
        },
    ]

    const quickActions = [
        { label: 'Add Medicine', icon: Plus, path: '/admin/inventory', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'View Machines', icon: Monitor, path: '/admin/machines', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
        { label: 'Manage Users', icon: Users, path: '/admin/users', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        { label: 'Inventory', icon: Package, path: '/admin/inventory', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    ]

    return (
        <AnimatedPage>
            {/* Command Palette */}
            <AnimatePresence>
                {showPalette && <CommandPalette onClose={() => setShowPalette(false)} navigate={navigate} />}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs text-primary-400 font-semibold uppercase tracking-widest mb-1">System Overview</p>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-dark-400 text-sm mt-0.5">Mission control for MediKiosk operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPalette(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-white text-sm transition-colors hover:border-dark-600"
                    >
                        <Command className="w-4 h-4" />
                        <span className="hidden sm:block">Command</span>
                        <kbd className="hidden sm:block text-xs bg-dark-700 px-1.5 py-0.5 rounded">⌃K</kbd>
                    </button>
                    <button
                        onClick={() => { setLoading(true); fetchAll() }}
                        className="p-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-white transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            {loading ? <SkeletonGrid count={4} className="mb-6" /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {statsConfig.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -3 }}
                            className={`rounded-2xl border ${stat.alert ? 'border-amber-500/30 animate-pulse' : 'border-dark-700/50'} p-5 flex flex-col gap-3 hover:shadow-xl transition-all duration-300`}
                            style={{ background: 'rgba(24,24,27,0.8)', backdropFilter: 'blur(12px)' }}
                        >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                                <p className="text-sm font-medium text-dark-400 mt-0.5">{stat.label}</p>
                                <p className="text-xs text-dark-600 mt-1">{stat.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Machine Health Grid ── */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-dark-700/50 p-5 h-full"
                        style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-primary-400" />
                                Machine Health Grid
                            </h3>
                            <button
                                onClick={() => navigate('/admin/machines')}
                                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                            >
                                View all <ArrowUpRight className="w-3 h-3" />
                            </button>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="h-28 rounded-xl bg-dark-800 animate-pulse" />
                                ))}
                            </div>
                        ) : machines.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {machines.slice(0, 6).map(m => (
                                    <MachineTile key={m.id} machine={m} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Monitor className="w-12 h-12 text-dark-600 mb-3" />
                                <p className="text-sm text-dark-400 font-medium">No machines registered</p>
                                <button
                                    onClick={() => navigate('/admin/machines')}
                                    className="mt-3 text-xs text-primary-400 hover:underline"
                                >Add machines →</button>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ── Quick Actions ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="rounded-2xl border border-dark-700/50 p-5"
                    style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}
                >
                    <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, i) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.08 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(action.path)}
                                className={`p-4 rounded-xl border ${action.bg} flex flex-col items-center gap-2 transition-all`}
                            >
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                                <span className="text-xs font-medium text-dark-300 text-center leading-tight">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Low stock alert */}
                    {statsData?.low_stock_count > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25"
                        >
                            <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alert
                            </p>
                            <p className="text-xs text-dark-400">{statsData.low_stock_count} items need restocking</p>
                            <button
                                onClick={() => navigate('/admin/inventory')}
                                className="mt-2 text-xs text-amber-400 hover:underline"
                            >Manage inventory →</button>
                        </motion.div>
                    )}
                </motion.div>

                {/* ── Hourly Bar Chart ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="lg:col-span-3 rounded-2xl border border-dark-700/50 p-5"
                    style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-primary-400" />
                            Dispensing Activity — Today
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-dark-400">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            <span>Current hour</span>
                        </div>
                    </div>
                    <HourlyChart data={hourlyData} />
                    <div className="flex justify-between mt-2 text-[10px] text-dark-600">
                        <span>12AM</span><span>3AM</span><span>6AM</span><span>9AM</span>
                        <span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>Now</span>
                    </div>
                    <div className="mt-3 text-xs text-dark-400">
                        Total dispensed today: <span className="text-white font-semibold">
                            {hourlyData.reduce((a, b) => a + b, 0)}
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    )
}
