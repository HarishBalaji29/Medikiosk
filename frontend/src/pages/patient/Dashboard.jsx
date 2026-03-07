import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import api from '../../services/api'
import {
    ScanLine, Pill, Clock, Bell, TrendingUp,
    History, ChevronRight, Activity, Calendar, Inbox
} from 'lucide-react'

export default function PatientDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [recentMedicines, setRecentMedicines] = useState([])
    const [stats, setStats] = useState({ totalPrescriptions: 0, dispensed: 0, pending: 0 })

    useEffect(() => {
        // Try to load prescription history from localStorage (from OCR scans)
        const ocrResult = JSON.parse(localStorage.getItem('medikiosk_ocr_result') || 'null')
        if (ocrResult?.medicines?.length) {
            setRecentMedicines(ocrResult.medicines.map(m => ({
                name: `${m.name} ${m.dosage || ''}`.trim(),
                date: new Date().toISOString().split('T')[0],
                status: 'processed',
                qty: 1,
            })))
            setStats(prev => ({ ...prev, totalPrescriptions: 1, dispensed: 0, pending: 1 }))
        }
    }, [])

    const statCards = [
        { label: 'Total Prescriptions', value: stats.totalPrescriptions, icon: Pill, color: 'text-primary-400' },
        { label: 'Medicines Dispensed', value: stats.dispensed, icon: Activity, color: 'text-emerald-400' },
        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-400' },
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
                {/* Scan CTA */}
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
                {statCards.map((stat) => (
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
                    </div>
                    <div className="space-y-3">
                        {recentMedicines.length > 0 ? (
                            recentMedicines.map((med, i) => (
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
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Inbox className="w-10 h-10 text-dark-600 mx-auto mb-3" />
                                <p className="text-sm text-dark-400">No medicine history yet</p>
                                <p className="text-xs text-dark-500 mt-1">Upload a prescription to get started</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Notifications */}
                <Card variant="glass" hover={false}>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-amber-400" />
                        Notifications
                    </h3>
                    <div className="text-center py-6">
                        <Bell className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                        <p className="text-sm text-dark-400">No notifications</p>
                    </div>
                </Card>
            </div>
        </AnimatedPage>
    )
}
