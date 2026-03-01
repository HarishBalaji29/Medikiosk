import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    ScanLine, Pill, Clock, Bell, TrendingUp,
    History, ChevronRight, Activity, Calendar
} from 'lucide-react'

const recentMedicines = [
    { name: 'Amoxicillin 500mg', date: '2026-02-24', status: 'dispensed', qty: 21 },
    { name: 'Paracetamol 650mg', date: '2026-02-22', status: 'dispensed', qty: 10 },
    { name: 'Cetirizine 10mg', date: '2026-02-20', status: 'pending', qty: 14 },
]

const notifications = [
    { text: 'Prescription #1042 approved by Dr. Patel', time: '2h ago', type: 'success' },
    { text: 'Medicine refill reminder: Metformin', time: '5h ago', type: 'warning' },
    { text: 'New health tip available', time: '1d ago', type: 'info' },
]

export default function PatientDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const stats = [
        { label: 'Total Prescriptions', value: '12', icon: Pill, color: 'text-primary-400' },
        { label: 'Medicines Dispensed', value: '34', icon: Activity, color: 'text-emerald-400' },
        { label: 'Pending Review', value: '2', icon: Clock, color: 'text-amber-400' },
    ]

    return (
        <AnimatedPage>
            {/* Welcome */}
            <div className="mb-8">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Welcome back, <span className="text-gradient">{user?.name || 'Patient'}</span> 👋
                </motion.h1>
                <p className="text-dark-400">Here's your health overview for today</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Scan CTA - Large Card */}
                <Card variant="accent" span={2} glow="blue" onClick={() => navigate('/patient/upload')} className="group">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Scan Prescription</h2>
                            <p className="text-dark-400 mb-4">Upload or capture your prescription for AI-powered analysis</p>
                            <Button icon={ScanLine} iconRight={ChevronRight} size="lg">
                                Start Scanning
                            </Button>
                        </div>
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="hidden md:flex w-24 h-24 rounded-2xl bg-primary-500/10 border border-primary-500/20 items-center justify-center"
                        >
                            <ScanLine className="w-12 h-12 text-primary-400" />
                        </motion.div>
                    </div>
                </Card>

                {/* Stats */}
                {stats.map((stat, i) => (
                    <Card key={stat.label} variant="glass">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-dark-400">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Medicine History */}
                <Card variant="default" span={2} hover={false}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-primary-400" />
                            Medicine History
                        </h3>
                        <button className="text-xs text-primary-400 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {recentMedicines.map((med, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-dark-700/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                        <Pill className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{med.name}</p>
                                        <p className="text-xs text-dark-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {med.date} · Qty: {med.qty}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={med.status === 'dispensed' ? 'success' : 'pending'} label={med.status} />
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Notifications */}
                <Card variant="glass" hover={false}>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-amber-400" />
                        Notifications
                    </h3>
                    <div className="space-y-3">
                        {notifications.map((notif, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="p-3 rounded-lg bg-dark-800/30 border-l-2 border-dark-700"
                                style={{ borderLeftColor: notif.type === 'success' ? '#10B981' : notif.type === 'warning' ? '#F59E0B' : '#3B82F6' }}
                            >
                                <p className="text-sm text-dark-300">{notif.text}</p>
                                <p className="text-xs text-dark-500 mt-1">{notif.time}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>
        </AnimatedPage>
    )
}
