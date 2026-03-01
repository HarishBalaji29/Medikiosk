import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { Pill, CheckCircle2, XCircle, Package, Loader2 } from 'lucide-react'

const dispensingItems = [
    { name: 'Amoxicillin 500mg', qty: 14, available: true },
    { name: 'Paracetamol 650mg', qty: 10, available: true },
    { name: 'Omeprazole 20mg', qty: 14, available: true },
    { name: 'Cetirizine Syrup', qty: 1, available: false },
]

export default function Dispensing() {
    const navigate = useNavigate()
    const [currentItem, setCurrentItem] = useState(0)
    const [statuses, setStatuses] = useState(dispensingItems.map(() => 'waiting'))

    useEffect(() => {
        const dispenseNext = (index) => {
            if (index >= dispensingItems.length) {
                setTimeout(() => navigate('/patient/success'), 1500)
                return
            }
            setCurrentItem(index)
            setStatuses(prev => { const n = [...prev]; n[index] = 'dispensing'; return n })

            setTimeout(() => {
                setStatuses(prev => {
                    const n = [...prev]
                    n[index] = dispensingItems[index].available ? 'done' : 'unavailable'
                    return n
                })
                setTimeout(() => dispenseNext(index + 1), 500)
            }, 1500 + Math.random() * 1000)
        }
        const t = setTimeout(() => dispenseNext(0), 1000)
        return () => clearTimeout(t)
    }, [navigate])

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Dispensing</h1>
                <p className="text-dark-400">Your medicines are being dispensed</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vending Machine Animation */}
                <Card variant="accent" span={2} hover={false} className="flex items-center justify-center min-h-[350px]">
                    <div className="text-center">
                        {/* Machine Body */}
                        <motion.div
                            className="relative w-48 h-64 mx-auto mb-6"
                        >
                            {/* Machine frame */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-dark-700 to-dark-800 border-2 border-dark-600 overflow-hidden">
                                {/* Screen */}
                                <div className="mx-4 mt-4 h-20 rounded-lg bg-dark-900 border border-dark-600 flex items-center justify-center">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-primary-400 text-xs font-mono"
                                    >
                                        DISPENSING...
                                    </motion.div>
                                </div>

                                {/* Slots */}
                                <div className="grid grid-cols-3 gap-1 mx-4 mt-3">
                                    {[...Array(9)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="h-6 rounded bg-dark-950/50 border border-dark-700/50"
                                            animate={i === currentItem % 9 ? { borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)' } : {}}
                                        />
                                    ))}
                                </div>

                                {/* Dispense Slot */}
                                <motion.div
                                    className="mx-4 mt-3 h-14 rounded-lg bg-dark-950 border-2 border-dark-600 flex items-center justify-center"
                                    animate={statuses[currentItem] === 'dispensing' ? {
                                        borderColor: ['#3F3F46', '#3B82F6', '#3F3F46'],
                                        boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.3)', '0 0 0px rgba(59,130,246,0)'],
                                    } : {}}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <AnimatePresence>
                                        {statuses[currentItem] === 'dispensing' && (
                                            <motion.div
                                                initial={{ y: -40, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 20, opacity: 0 }}
                                            >
                                                <Pill className="w-6 h-6 text-primary-400" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Glow */}
                            <motion.div
                                className="absolute -inset-4 rounded-3xl"
                                animate={{
                                    boxShadow: ['0 0 20px rgba(59,130,246,0.1)', '0 0 40px rgba(59,130,246,0.2)', '0 0 20px rgba(59,130,246,0.1)'],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        <p className="text-dark-400 text-sm">
                            Processing {currentItem + 1} of {dispensingItems.length}
                        </p>
                    </div>
                </Card>

                {/* Item Status */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Dispensing Status</h3>
                    {dispensingItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card variant="default" hover={false} className="!p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${statuses[i] === 'done' ? 'bg-emerald-500/20' :
                                            statuses[i] === 'unavailable' ? 'bg-rose-500/20' :
                                                statuses[i] === 'dispensing' ? 'bg-primary-500/20' :
                                                    'bg-dark-800'}
                  `}>
                                        {statuses[i] === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                                            statuses[i] === 'unavailable' ? <XCircle className="w-4 h-4 text-rose-400" /> :
                                                statuses[i] === 'dispensing' ? <Loader2 className="w-4 h-4 text-primary-400 animate-spin" /> :
                                                    <Package className="w-4 h-4 text-dark-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${statuses[i] === 'unavailable' ? 'text-dark-500 line-through' : 'text-white'}`}>
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-dark-400">Qty: {item.qty}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    )
}
