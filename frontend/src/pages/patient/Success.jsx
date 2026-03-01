import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { CheckCircle2, Download, Home, Pill, Clock, Hash, Calendar } from 'lucide-react'

const receiptItems = [
    { name: 'Amoxicillin 500mg', qty: 14 },
    { name: 'Paracetamol 650mg', qty: 10 },
    { name: 'Omeprazole 20mg', qty: 14 },
]

export default function Success() {
    const navigate = useNavigate()

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto py-8">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{
                            boxShadow: [
                                '0 0 0 0 rgba(16, 185, 129, 0.4)',
                                '0 0 0 40px rgba(16, 185, 129, 0)',
                            ],
                        }}
                        transition={{ duration: 1.5, repeat: 2 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Medicine Dispensed Successfully!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-dark-400"
                    >
                        Your prescription has been processed and medicines are ready
                    </motion.p>
                </motion.div>

                {/* Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Card variant="glass" hover={false}>
                        <div className="border-b border-dark-700/50 pb-4 mb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Dispensing Receipt</h3>
                                <span className="text-xs text-dark-400 bg-dark-800 px-3 py-1 rounded-full">
                                    #RX-2026-1042
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Date</p>
                                    <p className="text-sm font-medium text-white">25 Feb 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Time</p>
                                    <p className="text-sm font-medium text-white">11:42 PM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Transaction ID</p>
                                    <p className="text-sm font-medium text-white">TXN-87432</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Total Items</p>
                                    <p className="text-sm font-medium text-white">{receiptItems.length} medicines</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 mb-6">
                            {receiptItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm text-white">{item.name}</span>
                                    </div>
                                    <span className="text-sm text-dark-400">x{item.qty}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button variant="secondary" icon={Download} className="flex-1">
                                Download Receipt
                            </Button>
                            <Button variant="emerald" icon={Home} onClick={() => navigate('/patient/dashboard')} className="flex-1">
                                Return to Dashboard
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="fixed w-2 h-2 rounded-full bg-emerald-400/40"
                        style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 30}%` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -100] }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 2 }}
                    />
                ))}
            </div>
        </AnimatedPage>
    )
}
