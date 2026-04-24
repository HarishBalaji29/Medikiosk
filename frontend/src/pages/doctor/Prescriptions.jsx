import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedPage from '../../components/shared/AnimatedPage'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import { Search, Calendar, FileText, ChevronRight, ChevronDown, Pill, Clock, X, Inbox } from 'lucide-react'
import api from '../../services/api'

function PrescriptionModal({ prescription, onClose }) {
    if (!prescription) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-dark-900 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-dark-800 bg-dark-900/50">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-400" />
                        Prescription #{prescription.id}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {/* Patient Info Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-blue-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-lg">
                                {(prescription.patient_name || 'U')[0]}
                            </div>
                            <div>
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    {prescription.patient_name || 'Unknown Patient'}
                                </h3>
                                <p className="text-sm text-dark-400 flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="w-3.5 h-3.5" /> 
                                    {prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <StatusBadge 
                            status={prescription.status === 'approved' ? 'success' : prescription.status === 'rejected' ? 'error' : 'pending'} 
                            label={prescription.status} 
                        />
                    </div>

                    {/* Detected Medicines */}
                    <div>
                        <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-emerald-400" /> Extracted Medicines
                        </h4>
                        
                        {prescription.medicines?.length > 0 ? (
                            <div className="space-y-2 relative">
                                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-dark-800" />
                                {prescription.medicines.map((med, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-3 bg-dark-800/30 rounded-xl border border-dark-800 relative bg-clip-padding backdrop-filter backdrop-blur-sm">
                                        <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                                            <span className="text-xs font-semibold text-dark-300">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{med.name} <span className="text-dark-400 font-normal ml-1">{med.dosage}</span></p>
                                            <p className="text-xs text-dark-400 flex items-center gap-1.5 mt-1">
                                                <Clock className="w-3 h-3 text-dark-500" /> {med.frequency || 'As prescribed'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 text-dark-400 text-sm">
                                No specific medicines structured from this prescription yet.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function DoctorPrescriptions() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRx, setSelectedRx] = useState(null)
    const [expandedPatients, setExpandedPatients] = useState(new Set()) // Tracks which patient groups are expanded

    useEffect(() => {
        fetchPrescriptions()
    }, [])

    const fetchPrescriptions = async () => {
        try {
            setLoading(true)
            const res = await api.get('/doctor/prescriptions')
            setItems(res.data)
        } catch (error) {
            console.error('Failed to fetch prescriptions:', error)
        } finally {
            setLoading(false)
        }
    }

    const filtered = items.filter(rx =>
        (rx.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.id.toString().includes(searchTerm)
    )

    // Group by patience name
    const grouped = filtered.reduce((acc, rx) => {
        const name = rx.patient_name || 'Unknown Patient';
        if (!acc[name]) acc[name] = [];
        acc[name].push(rx);
        return acc;
    }, {});

    const patientNames = Object.keys(grouped).sort();

    const togglePatient = (name) => {
        setExpandedPatients(prev => {
            const next = new Set(prev)
            if (next.has(name)) {
                next.delete(name)
            } else {
                next.add(name)
            }
            return next
        })
    }

    return (
        <AnimatedPage>
            <AnimatePresence>
                {selectedRx && <PrescriptionModal prescription={selectedRx} onClose={() => setSelectedRx(null)} />}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <FileText className="text-primary-400 w-6 h-6" />
                        Patient Prescriptions
                    </h1>
                    <p className="text-dark-400">Clean directory grouped by patient uploads and extraction data</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-dark-900 border border-dark-700 rounded-xl px-4 py-2 w-full sm:w-72 focus-within:border-primary-500/50 transition-colors shadow-inner">
                        <Search className="w-4 h-4 text-dark-500" />
                        <input
                            type="text"
                            placeholder="Search Patient Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-dark-500"
                        />
                    </div>
                </div>
            </div>

            <Card variant="glass" hover={false} className="!p-0 border-dark-700/50 overflow-hidden shadow-2xl">
                {!loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/40 border-b border-dark-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Patient Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Total Records</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {patientNames.map((patientName, i) => {
                                        const patientRecords = grouped[patientName];
                                        const isExpanded = expandedPatients.has(patientName);

                                        return (
                                            <React.Fragment key={patientName}>
                                                {/* Parent Row */}
                                                <motion.tr 
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors group cursor-pointer"
                                                    onClick={() => togglePatient(patientName)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-dark-800 border items-center justify-center flex text-dark-300 font-medium text-xs border-dark-700 group-hover:border-primary-500/30 transition-colors">
                                                                {patientName[0]}
                                                            </div>
                                                            <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{patientName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-medium text-dark-300 bg-dark-800 px-3 py-1 rounded-full border border-dark-700">
                                                            {patientRecords.length} {patientRecords.length === 1 ? 'Prescription' : 'Prescriptions'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            className="inline-flex items-center justify-center p-1.5 rounded-lg text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-all"
                                                        >
                                                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary-400' : ''}`} />
                                                        </button>
                                                    </td>
                                                </motion.tr>

                                                {/* Expanded Child Rows */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.tr 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="bg-dark-900/30 border-b border-dark-800"
                                                        >
                                                            <td colSpan="3" className="p-0">
                                                                <div className="bg-dark-950/50 px-6 py-4 border-l-2 border-primary-500/50 ml-[52px]">
                                                                    <table className="w-full text-left">
                                                                        <thead>
                                                                            <tr className="border-b border-dark-800">
                                                                                <th className="pb-3 text-[10px] font-semibold text-dark-500 uppercase tracking-wider">Date / ID</th>
                                                                                <th className="pb-3 text-[10px] font-semibold text-dark-500 uppercase tracking-wider w-1/2">Medicines</th>
                                                                                <th className="pb-3 text-[10px] font-semibold text-dark-500 uppercase tracking-wider">Status</th>
                                                                                <th className="pb-3 text-[10px] font-semibold text-dark-500 uppercase tracking-wider text-right">Review</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {patientRecords.map(rx => (
                                                                                <tr key={rx.id} className="border-b border-dark-800/30 last:border-0 hover:bg-dark-800/10 cursor-pointer" onClick={() => setSelectedRx(rx)}>
                                                                                    <td className="py-4">
                                                                                        <p className="text-sm text-dark-300">
                                                                                            {rx.created_at ? new Date(rx.created_at).toLocaleDateString() : '—'}
                                                                                        </p>
                                                                                        <p className="text-[10px] text-dark-500 font-mono mt-0.5">#{rx.id}</p>
                                                                                    </td>
                                                                                    <td className="py-4">
                                                                                        {rx.medicines?.length > 0 ? (
                                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                                {rx.medicines.slice(0, 3).map((m, idx) => (
                                                                                                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-dark-800 border border-dark-700 text-dark-300">
                                                                                                        {m.name}
                                                                                                    </span>
                                                                                                ))}
                                                                                                {rx.medicines.length > 3 && (
                                                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                                                                                                        +{rx.medicines.length - 3}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-xs text-dark-500 italic">None logged</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="py-4">
                                                                                        <StatusBadge 
                                                                                            status={rx.status === 'approved' ? 'success' : rx.status === 'rejected' ? 'error' : 'pending'} 
                                                                                            label={rx.status} 
                                                                                        />
                                                                                    </td>
                                                                                    <td className="py-4 text-right">
                                                                                        <button 
                                                                                            onClick={(e) => { e.stopPropagation(); setSelectedRx(rx); }}
                                                                                            className="inline-flex items-center gap-1 text-xs font-medium text-dark-400 hover:text-primary-400 transition-colors"
                                                                                        >
                                                                                            View <ChevronRight className="w-3.5 h-3.5" />
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    )}
                                                </AnimatePresence>
                                            </React.Fragment>
                                        )
                                    })}
                                    {patientNames.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-16 text-center">
                                                <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                                                <p className="text-dark-300 font-medium">No Prescriptions Found</p>
                                                <p className="text-sm text-dark-500 mt-1">Adjust search criteria</p>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-dark-400">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-medium text-white">Loading records...</p>
                    </div>
                )}
            </Card>
        </AnimatedPage>
    )
}
