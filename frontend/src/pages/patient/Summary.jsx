import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Pill, Stethoscope, RotateCcw, ShoppingCart,
    CheckCircle2, AlertCircle, IndianRupee, Clock, Package
} from 'lucide-react'

const medicines = [
    { name: 'Amoxicillin', dosage: '500mg', frequency: '1-0-1 (Twice daily)', duration: '7 days', qty: 14, price: 5.50, available: true },
    { name: 'Paracetamol', dosage: '650mg', frequency: 'SOS (As needed)', duration: 'As needed', qty: 10, price: 2.00, available: true },
    { name: 'Omeprazole', dosage: '20mg', frequency: '1-0-0 (Morning)', duration: '14 days', qty: 14, price: 8.00, available: true },
    { name: 'Cetirizine Syrup', dosage: '5mg/5ml', frequency: '10ml at bedtime', duration: '5 days', qty: 1, price: 45.00, available: false },
]

export default function Summary() {
    const navigate = useNavigate()
    const [confirmed, setConfirmed] = useState(false)

    const availableCount = medicines.filter(m => m.available).length
    const totalCost = medicines.filter(m => m.available).reduce((a, m) => a + m.price * m.qty, 0)

    const handleDispense = () => {
        setConfirmed(true)
        setTimeout(() => navigate('/patient/dispensing'), 600)
    }

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Prescription Summary</h1>
                <p className="text-dark-400">Review detected medicines before dispensing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doctor Info */}
                <Card variant="glass" hover={false} className="lg:col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                            <Stethoscope className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Dr. Priya Patel</h3>
                            <p className="text-sm text-dark-400">MBBS, MD (General Medicine) · MCI-45821</p>
                            <div className="flex items-center gap-2 mt-1">
                                <StatusBadge status="success" label="Verified" />
                                <span className="text-xs text-dark-500">• Prescribed on 25 Feb 2026</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Summary Stats */}
                <Card variant="accent" hover={false}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-dark-800/50">
                            <Package className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-white">{medicines.length}</p>
                            <p className="text-xs text-dark-400">Medicines</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-dark-800/50">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-white">{availableCount}</p>
                            <p className="text-xs text-dark-400">Available</p>
                        </div>
                    </div>
                </Card>

                {/* Medicine Table */}
                <div className="lg:col-span-3 space-y-3">
                    {medicines.map((med, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <Card variant={med.available ? 'default' : 'default'} hover={false}>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.available ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                                            <Pill className={`w-5 h-5 ${med.available ? 'text-primary-400' : 'text-rose-400'}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white">{med.name}</h4>
                                                <span className="text-xs text-dark-400 bg-dark-800 px-2 py-0.5 rounded">{med.dosage}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                <span className="text-xs text-dark-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {med.frequency}
                                                </span>
                                                <span className="text-xs text-dark-400">Duration: {med.duration}</span>
                                                <span className="text-xs text-dark-400">Qty: {med.qty}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-white flex items-center">
                                            <IndianRupee className="w-3 h-3" />{(med.price * med.qty).toFixed(2)}
                                        </span>
                                        <StatusBadge
                                            status={med.available ? 'success' : 'error'}
                                            label={med.available ? 'In Stock' : 'Unavailable'}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Unavailable Warning */}
                {medicines.some(m => !m.available) && (
                    <Card variant="default" hover={false} className="lg:col-span-3 !border-amber-500/30 !bg-amber-500/5">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <p className="text-sm text-amber-300">
                                Some medicines are currently unavailable. Only available medicines will be dispensed.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Total & Actions */}
                <Card variant="glass" hover={false} className="lg:col-span-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <IndianRupee className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-dark-400">Total Cost</p>
                                <p className="text-2xl font-bold text-white flex items-center">
                                    <IndianRupee className="w-5 h-5" />{totalCost.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="secondary" icon={RotateCcw} onClick={() => navigate('/patient/upload')} className="flex-1 md:flex-none">
                                Re-scan
                            </Button>
                            <Button variant="emerald" icon={ShoppingCart} size="lg" onClick={handleDispense} loading={confirmed} className="flex-1 md:flex-none">
                                Confirm & Dispense
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </AnimatedPage>
    )
}
