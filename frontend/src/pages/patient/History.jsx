import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedPage from '../../components/shared/AnimatedPage'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import api from '../../services/api'
import { History, Search, Calendar as CalendarIcon, Inbox, Clock, Pill, List, CalendarDays, Filter } from 'lucide-react'

export default function PatientHistory() {
    const [recentMedicines, setRecentMedicines] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all') // all, dispensed, pending, rejected
    const [viewMode, setViewMode] = useState('list') // list, calendar

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/patient/prescriptions')
                const prescriptions = response.data
                
                let history = []
                prescriptions.forEach(p => {
                    if (p.medicines && Array.isArray(p.medicines)) {
                        p.medicines.forEach(m => {
                            history.push({
                                id: Math.random().toString(36).substr(2, 9),
                                name: `${m.name} ${m.dosage || ''}`.trim(),
                                frequency: m.frequency,
                                date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                                status: p.status,
                                doctor: p.doctor_name,
                                qty: 1,
                            })
                        })
                    }
                })
                setRecentMedicines(history)
            } catch (error) {
                console.error("Failed to fetch history:", error)
            }
        }
        
        fetchHistory()
    }, [])

    const filteredMeds = recentMedicines.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'all' || m.status === statusFilter
        return matchSearch && matchStatus
    })

    const filters = [
        { id: 'all', label: 'All History' },
        { id: 'dispensed', label: 'Dispensed' },
        { id: 'pending', label: 'Pending' },
        { id: 'rejected', label: 'Rejected' },
    ]

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <History className="text-primary-400 w-6 h-6" />
                        Medical History
                    </motion.h1>
                    <p className="text-dark-400">View your past prescriptions and medicines</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-dark-900 border border-dark-700/50 rounded-xl px-4 py-2 w-full sm:w-64 focus-within:border-primary-500/50 transition-colors">
                        <Search className="w-4 h-4 text-dark-500" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-white text-sm w-full"
                        />
                    </div>
                    {/* View mode toggle */}
                    <div className="flex items-center bg-dark-900 border border-dark-700/50 rounded-xl p-1 flex-shrink-0">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-dark-700 text-white' : 'text-dark-500 hover:text-dark-300'}`}>
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-dark-700 text-white' : 'text-dark-500 hover:text-dark-300'}`}>
                            <CalendarDays className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 overflow-x-auto hide-scrollbar">
                <Filter className="w-4 h-4 text-dark-500 mr-2 flex-shrink-0" />
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setStatusFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${statusFilter === f.id ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' : 'bg-dark-800/50 text-dark-400 border-dark-700/50 hover:bg-dark-800'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <Card variant="glass" hover={false} className="min-h-[400px]">
                {viewMode === 'list' ? (
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredMeds.length > 0 ? (
                                filteredMeds.map((med, i) => (
                                    <motion.div
                                        layout
                                        key={med.id || i}
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-dark-900/60 border border-dark-700 hover:border-dark-600 transition-colors gap-4 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${med.status === 'dispensed' ? 'bg-emerald-500/10 border-emerald-500/20' : med.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' : med.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-primary-500/10 border-primary-500/20'}`}>
                                                <Pill className={`w-6 h-6 ${med.status === 'dispensed' ? 'text-emerald-400' : med.status === 'pending' ? 'text-amber-400' : med.status === 'rejected' ? 'text-rose-400' : 'text-primary-400'}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors">{med.name}</h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-dark-400">
                                                    <span className="flex items-center gap-1.5 bg-dark-800 px-2 py-0.5 rounded text-dark-300">
                                                        <CalendarIcon className="w-3 h-3" /> {med.date}
                                                    </span>
                                                    {med.frequency && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3 text-dark-500" /> {med.frequency}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1.5 justify-between">
                                            <div className="flex flex-col items-end">
                                                <StatusBadge 
                                                    status={med.status === 'dispensed' || med.status === 'approved' ? 'success' : med.status === 'rejected' ? 'error' : 'pending'} 
                                                    label={med.status} 
                                                />
                                                {med.doctor && (
                                                    <p className={`text-[10px] mt-1.5 leading-tight ${med.status === 'dispensed' ? 'text-emerald-500/70' : med.status === 'rejected' ? 'text-rose-500/70' : 'text-dark-500'}`}>
                                                        by Dr. {med.doctor}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-dark-400 bg-dark-800 px-2.5 py-1 rounded border border-dark-700">Qty: {med.qty}</span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                                    <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-1">No History Found</h3>
                                    <p className="text-dark-400 text-sm">You dont have any previous records matching your filters.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
                        <CalendarDays className="w-16 h-16 text-dark-700 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Calendar View Coming Soon</h3>
                        <p className="text-dark-400 text-sm">Visual monthly calendar of all your prescriptions</p>
                        <button onClick={() => setViewMode('list')} className="mt-4 px-4 py-2 bg-dark-800 text-sm text-white rounded-lg hover:bg-dark-700 transition-colors">
                            Return to List View
                        </button>
                    </motion.div>
                )}
            </Card>
        </AnimatedPage>
    )
}
