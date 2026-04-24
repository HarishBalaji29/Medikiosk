import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedPage from '../../components/shared/AnimatedPage'
import Card from '../../components/ui/Card'
import { Users, Search, Phone, Mail, Loader2, FileText } from 'lucide-react'
import api from '../../services/api'

export default function DoctorPatientLogs() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            setLoading(true)
            const res = await api.get('/doctor/patients')
            setPatients(res.data)
        } catch (error) {
            console.error('Failed to fetch patients:', error)
        } finally {
            setLoading(false)
        }
    }

    const filtered = patients.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.phone || '').includes(searchTerm)
    )

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Users className="text-emerald-400 w-6 h-6" />
                        Patient Logs
                    </h1>
                    <p className="text-dark-400">Manage your patient database and view medical histories</p>
                </div>

                <div className="flex items-center gap-2 bg-dark-900 border border-dark-700/50 rounded-xl px-4 py-2 w-full md:w-64 focus-within:border-emerald-500/50 transition-colors">
                    <Search className="w-5 h-5 text-dark-500" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white text-sm w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full">
                        <Card variant="glass" hover={false} className="flex flex-col items-center justify-center py-16 text-dark-400">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                            <p>Loading patient directory...</p>
                        </Card>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full">
                        <Card variant="glass" className="min-h-[300px] flex items-center justify-center">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-dark-500" />
                                </div>
                                <p className="text-dark-400 font-medium">Directory Empty</p>
                                <p className="text-sm text-dark-500 mt-1">No patients match your search criteria.</p>
                            </div>
                        </Card>
                    </div>
                ) : (
                    filtered.map((patient, i) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card variant="glass" hover={true} className="h-full flex flex-col">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                                        <span className="text-lg font-bold text-emerald-400 uppercase">
                                            {(patient.name || 'P').charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate">{patient.name || 'Unknown Patient'}</h3>
                                        <div className="flex items-center gap-1.5 mt-1 text-sm text-dark-400">
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>{patient.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-dark-700/50 flex items-center justify-between">
                                    <span className="text-xs text-dark-400">Patient ID: #{patient.id}</span>
                                    <div className="flex items-center text-xs gap-1.5 bg-dark-800/80 px-2 py-1 rounded-md border border-dark-700">
                                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-white font-medium">{patient.rx_count || 0}</span> Prescriptions
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </AnimatedPage>
    )
}
