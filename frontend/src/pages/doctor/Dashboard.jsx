import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    FileText, Clock, CheckCircle2, XCircle, Eye,
    ChevronDown, ChevronUp, Pill, User, Calendar,
    TrendingUp, AlertCircle, Inbox
} from 'lucide-react'

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('pending')
    const [expandedId, setExpandedId] = useState(null)
    const [items, setItems] = useState([])

    const tabs = [
        { id: 'pending', label: 'Pending', icon: Clock, count: items.filter(p => p.status === 'pending').length },
        { id: 'approved', label: 'Approved', icon: CheckCircle2, count: items.filter(p => p.status === 'approved').length },
        { id: 'rejected', label: 'Rejected', icon: XCircle, count: items.filter(p => p.status === 'rejected').length },
    ]

    const filtered = items.filter(p => p.status === activeTab)

    const handleAction = (id, action) => {
        setItems(prev => prev.map(p => p.id === id ? { ...p, status: action } : p))
        setExpandedId(null)
    }

    const stats = [
        { label: 'Pending Review', value: items.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Approved Today', value: items.filter(p => p.status === 'approved').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Rejected', value: items.filter(p => p.status === 'rejected').length, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { label: 'Total Prescriptions', value: items.length, icon: TrendingUp, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    ]

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Doctor Dashboard</h1>
                <p className="text-dark-400">Review and manage patient prescriptions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card variant="glass" hover={false} className="!p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-dark-400">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-dark-900/60 rounded-xl p-1 border border-dark-700/50">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center
              ${activeTab === tab.id ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-white'}
            `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-xs flex items-center justify-center ${activeTab === tab.id ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-700 text-dark-400'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Prescription List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <Card variant="glass" hover={false}>
                        <div className="text-center py-12">
                            <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                            <p className="text-dark-400 font-medium">No {activeTab} prescriptions</p>
                            <p className="text-xs text-dark-500 mt-1">Prescriptions will appear here when patients upload them</p>
                        </div>
                    </Card>
                ) : (
                    filtered.map((rx, i) => (
                        <motion.div
                            key={rx.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card variant="default" hover={false}>
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold text-white">
                                            {(rx.patient || 'P').charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white">{rx.patient || 'Patient'}</h4>
                                                {rx.age && <span className="text-xs text-dark-400">Age: {rx.age}</span>}
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-xs text-dark-400 flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> {rx.id}
                                                </span>
                                                <span className="text-xs text-dark-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {rx.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge
                                            status={rx.status === 'approved' ? 'success' : rx.status === 'rejected' ? 'error' : 'pending'}
                                            label={rx.status}
                                        />
                                        {expandedId === rx.id ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedId === rx.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 pt-4 border-t border-dark-700/50">
                                                <div className="mb-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Eye className="w-4 h-4 text-primary-400" />
                                                        <span className="text-sm font-medium text-white">Prescription Details</span>
                                                        {rx.confidence && <span className="text-xs text-dark-400 ml-auto">Confidence: {rx.confidence}%</span>}
                                                    </div>
                                                </div>

                                                {rx.medicines?.length > 0 && (
                                                    <div className="mb-4">
                                                        <h5 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                                            <Pill className="w-4 h-4 text-emerald-400" /> Extracted Medicines
                                                        </h5>
                                                        <div className="space-y-2">
                                                            {rx.medicines.map((med, mi) => (
                                                                <div key={mi} className="flex items-center justify-between p-2 rounded-lg bg-dark-800/30">
                                                                    <span className="text-sm text-white">{med.name}</span>
                                                                    <span className="text-xs text-dark-400">{med.dosage} · {med.duration}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {rx.status === 'pending' && (
                                                    <div className="flex gap-3">
                                                        <Button variant="emerald" icon={CheckCircle2} onClick={() => handleAction(rx.id, 'approved')} className="flex-1">
                                                            Approve
                                                        </Button>
                                                        <Button variant="danger" icon={XCircle} onClick={() => handleAction(rx.id, 'rejected')} className="flex-1">
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </AnimatedPage>
    )
}
