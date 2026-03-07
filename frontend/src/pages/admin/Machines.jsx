import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { Monitor, Wifi, WifiOff, Clock, AlertTriangle, RefreshCw, Pill, Zap, Inbox } from 'lucide-react'

export default function Machines() {
    const [machines] = useState([])
    const [lastRefresh, setLastRefresh] = useState(new Date())
    const [countdown, setCountdown] = useState(10)

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setLastRefresh(new Date())
                    return 10
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const statusColors = {
        online: 'from-emerald-500 to-green-600',
        offline: 'from-dark-600 to-dark-700',
        maintenance: 'from-amber-500 to-orange-600',
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Machine Monitoring</h1>
                    <p className="text-dark-400">Real-time kiosk status and diagnostics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-xs text-dark-400">
                        <RefreshCw className={`w-3 h-3 ${countdown <= 2 ? 'animate-spin text-primary-400' : ''}`} />
                        Auto-refresh in {countdown}s
                    </div>
                </div>
            </div>

            {/* Machine Grid */}
            {machines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {machines.map((machine, i) => (
                        <motion.div
                            key={machine.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card variant="glass" hover={true}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[machine.status] || statusColors.offline} flex items-center justify-center`}>
                                        <Monitor className="w-6 h-6 text-white" />
                                    </div>
                                    <StatusBadge status={machine.status === 'online' ? 'online' : machine.status === 'offline' ? 'offline' : 'warning'} label={machine.status} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">{machine.name}</h3>
                                <p className="text-xs text-dark-400 mb-4">{machine.location}</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-2 rounded-lg bg-dark-800/50 text-center">
                                        <Clock className="w-3 h-3 text-dark-400 mx-auto mb-1" />
                                        <p className="text-xs text-dark-300">{machine.lastDispense || '—'}</p>
                                        <p className="text-[10px] text-dark-500">Last Dispense</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-dark-800/50 text-center">
                                        <Pill className="w-3 h-3 text-primary-400 mx-auto mb-1" />
                                        <p className="text-xs text-white font-semibold">{machine.dispensedToday || 0}</p>
                                        <p className="text-[10px] text-dark-500">Today</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-dark-800/50 text-center">
                                        <AlertTriangle className={`w-3 h-3 mx-auto mb-1 ${machine.errorCount ? 'text-rose-400' : 'text-emerald-400'}`} />
                                        <p className={`text-xs font-semibold ${machine.errorCount ? 'text-rose-400' : 'text-emerald-400'}`}>{machine.errorCount || 0}</p>
                                        <p className="text-[10px] text-dark-500">Errors</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dark-700/30">
                                    <div className={`w-2 h-2 rounded-full ${machine.status === 'online' ? 'bg-emerald-400 animate-pulse' : machine.status === 'offline' ? 'bg-dark-500' : 'bg-amber-400 animate-pulse'}`} />
                                    <span className="text-xs text-dark-400">{machine.id}</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card variant="glass" hover={false} className="mb-8">
                    <div className="text-center py-16">
                        <Monitor className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                        <p className="text-dark-400 font-medium">No machines registered</p>
                        <p className="text-xs text-dark-500 mt-1">Machines will appear here when connected to the system</p>
                    </div>
                </Card>
            )}

            {/* Error Logs */}
            <Card variant="default" hover={false}>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    Error Logs
                </h3>
                <div className="text-center py-8">
                    <Inbox className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                    <p className="text-sm text-dark-400">No error logs</p>
                </div>
            </Card>
        </AnimatedPage>
    )
}
