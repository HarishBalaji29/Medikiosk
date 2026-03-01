import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { Monitor, Wifi, WifiOff, Clock, AlertTriangle, RefreshCw, Pill, Zap } from 'lucide-react'

const initialMachines = [
    { id: 'MK-001', name: 'Kiosk Alpha', location: 'Building A — Ground Floor', status: 'online', lastDispense: '2 min ago', dispensedToday: 42, errorCount: 0 },
    { id: 'MK-002', name: 'Kiosk Beta', location: 'Building A — 1st Floor', status: 'online', lastDispense: '15 min ago', dispensedToday: 38, errorCount: 0 },
    { id: 'MK-003', name: 'Kiosk Gamma', location: 'Building B — Reception', status: 'offline', lastDispense: '3 hr ago', dispensedToday: 12, errorCount: 2 },
    { id: 'MK-004', name: 'Kiosk Delta', location: 'Pharmacy Block', status: 'online', lastDispense: '5 min ago', dispensedToday: 55, errorCount: 0 },
    { id: 'MK-005', name: 'Kiosk Epsilon', location: 'Emergency Wing', status: 'maintenance', lastDispense: '1 day ago', dispensedToday: 0, errorCount: 5 },
    { id: 'MK-006', name: 'Kiosk Zeta', location: 'OPD Block C', status: 'online', lastDispense: '8 min ago', dispensedToday: 29, errorCount: 0 },
]

const errorLogs = [
    { machine: 'MK-003', error: 'Network connection timeout', time: '30 min ago', severity: 'warning' },
    { machine: 'MK-003', error: 'Dispenser motor stuck — Slot 4B', time: '45 min ago', severity: 'error' },
    { machine: 'MK-005', error: 'Scheduled maintenance — firmware update', time: '2 hr ago', severity: 'info' },
    { machine: 'MK-005', error: 'Temperature sensor malfunction', time: '3 hr ago', severity: 'error' },
    { machine: 'MK-005', error: 'Card reader error — reset required', time: '4 hr ago', severity: 'warning' },
]

export default function Machines() {
    const [machines, setMachines] = useState(initialMachines)
    const [lastRefresh, setLastRefresh] = useState(new Date())
    const [countdown, setCountdown] = useState(10)

    // Auto-refresh every 10 seconds
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

    const statusIcons = { online: Wifi, offline: WifiOff, maintenance: AlertTriangle }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {machines.map((machine, i) => {
                    const Icon = statusIcons[machine.status] || Wifi
                    return (
                        <motion.div
                            key={machine.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card variant="glass" hover={true}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[machine.status]} flex items-center justify-center`}>
                                        <Monitor className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={machine.status === 'online' ? 'online' : machine.status === 'offline' ? 'offline' : 'warning'} label={machine.status} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-1">{machine.name}</h3>
                                <p className="text-xs text-dark-400 mb-4">{machine.location}</p>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-2 rounded-lg bg-dark-800/50 text-center">
                                        <Clock className="w-3 h-3 text-dark-400 mx-auto mb-1" />
                                        <p className="text-xs text-dark-300">{machine.lastDispense}</p>
                                        <p className="text-[10px] text-dark-500">Last Dispense</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-dark-800/50 text-center">
                                        <Pill className="w-3 h-3 text-primary-400 mx-auto mb-1" />
                                        <p className="text-xs text-white font-semibold">{machine.dispensedToday}</p>
                                        <p className="text-[10px] text-dark-500">Today</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-dark-800/50 text-center">
                                        <AlertTriangle className={`w-3 h-3 mx-auto mb-1 ${machine.errorCount ? 'text-rose-400' : 'text-emerald-400'}`} />
                                        <p className={`text-xs font-semibold ${machine.errorCount ? 'text-rose-400' : 'text-emerald-400'}`}>{machine.errorCount}</p>
                                        <p className="text-[10px] text-dark-500">Errors</p>
                                    </div>
                                </div>

                                {/* Status Light */}
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dark-700/30">
                                    <div className={`w-2 h-2 rounded-full ${machine.status === 'online' ? 'bg-emerald-400 animate-pulse' : machine.status === 'offline' ? 'bg-dark-500' : 'bg-amber-400 animate-pulse'}`} />
                                    <span className="text-xs text-dark-400">{machine.id} · {machine.status === 'online' ? 'Connected' : machine.status === 'offline' ? 'Disconnected' : 'In Maintenance'}</span>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Error Logs */}
            <Card variant="default" hover={false}>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    Error Logs
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700/50">
                                <th className="text-left text-xs font-medium text-dark-400 uppercase px-4 py-3">Machine</th>
                                <th className="text-left text-xs font-medium text-dark-400 uppercase px-4 py-3">Error</th>
                                <th className="text-left text-xs font-medium text-dark-400 uppercase px-4 py-3">Time</th>
                                <th className="text-left text-xs font-medium text-dark-400 uppercase px-4 py-3">Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errorLogs.map((log, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-white font-mono">{log.machine}</td>
                                    <td className="px-4 py-3 text-sm text-dark-300">{log.error}</td>
                                    <td className="px-4 py-3 text-sm text-dark-400">{log.time}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            status={log.severity === 'error' ? 'error' : log.severity === 'warning' ? 'warning' : 'info'}
                                            label={log.severity}
                                        />
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AnimatedPage>
    )
}
