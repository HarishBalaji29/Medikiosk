import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedPage from '../../components/shared/AnimatedPage'
import Button from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import { Monitor, Wifi, WifiOff, Clock, AlertTriangle, RefreshCw, Pill, Send, Server, HardDrive, Cpu, Plus } from 'lucide-react'
import api from '../../services/api'

// Mock machine data if backend gives empty array
const MOCK_MACHINES = []

export default function Machines() {
    const [machines, setMachines] = useState([]) // Removed mock data
    const [countdown, setCountdown] = useState(15)
    const toast = useToast()

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const res = await api.get('/admin/machines/status')
                setMachines(res.data)
            } catch (error) {
                console.error("Failed to fetch fleet status", error)
            }
        }
        
        fetchMachines()
        
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    // Simulate refresh
                    fetchMachines() // Call again when countdown reaches 0
                    return 15
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])


    const handlePing = (machineId) => {
        toast(`Ping request sent to Machine ${machineId}`, 'info')
    }

    const handleRefillAlert = (machineId) => {
        toast(`Restock alert dispatched for ${machineId}`, 'success')
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Server className="w-6 h-6 text-primary-400" />
                        Machine Fleet
                    </h1>
                    <p className="text-dark-400">Real-time status and diagnostics of all connected dispensing units</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800 border border-dark-700 text-xs text-dark-400 font-mono">
                        <RefreshCw className={`w-3 h-3 ${countdown <= 3 ? 'animate-spin text-primary-400' : ''}`} />
                        Syncing in {countdown}s
                    </div>
                </div>
            </div>

            {machines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-dark-900/40 rounded-3xl border border-dark-700/50 backdrop-blur-sm shadow-2xl">
                    <div className="w-20 h-20 bg-dark-800 rounded-2xl border flex items-center justify-center border-dark-700 mb-6 shadow-inner">
                        <Monitor className="w-10 h-10 text-dark-600" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">No Kiosks Connected</h2>
                    <p className="text-dark-400 max-w-md text-center text-sm mb-6">
                        There are currently no smart medicine dispenser machines registered or connected to your network. Add a machine to monitor its live stock and diagnostics.
                    </p>
                    <Button icon={Plus} variant="primary" onClick={() => toast("Device registration wizard opened", "info")}>
                        Register New Kiosk
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {machines.map((machine, i) => {
                        const isOnline = machine.status === 'online'
                        const isMaintenance = machine.status === 'maintenance'
                        const isOffline = machine.status === 'offline'
                        
                        const statusColor = isOnline ? 'emerald' : isMaintenance ? 'amber' : 'rose'
                        const StatusIcon = isOnline ? Wifi : isMaintenance ? AlertTriangle : WifiOff

                        return (
                            <motion.div
                                key={machine.id}
                                initial={{ opacity: 0, y: 20, rotateX: 10 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                                style={{ perspective: 1000 }}
                                className="group h-full"
                            >
                                <div className={`relative h-full flex flex-col rounded-2xl border bg-dark-900/60 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                                    isOnline ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10' :
                                    isMaintenance ? 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/10' :
                                    'border-rose-500/20 hover:border-rose-500/40 hover:shadow-rose-500/10'
                                }`} style={{ transformStyle: 'preserve-3d' }}>
                                    
                                    {/* 3D Top Edge highlight */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                                        isOnline ? 'from-emerald-500/40 to-green-500/10' :
                                        isMaintenance ? 'from-amber-500/40 to-orange-500/10' :
                                        'from-rose-500/40 to-red-500/10'
                                    }`} />

                                    {/* Header block */}
                                    <div className="p-5 flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shadow-inner relative overflow-hidden ${
                                                isOnline ? 'bg-emerald-500/10 border-emerald-500/30' :
                                                isMaintenance ? 'bg-amber-500/10 border-amber-500/30' :
                                                'bg-rose-500/10 border-rose-500/30'
                                            }`}>
                                                <Monitor className={`w-7 h-7 relative z-10 ${
                                                    isOnline ? 'text-emerald-400' :
                                                    isMaintenance ? 'text-amber-400' :
                                                    'text-rose-400 opacity-50'
                                                }`} />
                                                {isOnline && (
                                                    <motion.div 
                                                        className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-emerald-500/20 to-transparent" 
                                                        animate={{ y: [20, -5, 20] }} 
                                                        transition={{ duration: 4, repeat: Infinity }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-0.5">{machine.name}</h3>
                                                <p className="text-xs text-dark-400 flex items-center gap-1.5 font-mono">
                                                    <HardDrive className="w-3 h-3" /> {machine.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${
                                            isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            isMaintenance ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                        }`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {machine.status}
                                        </div>
                                    </div>

                                    {/* Body metrics */}
                                    <div className="px-5 pb-5 flex-1 flex flex-col justify-center">
                                        <p className="text-sm text-dark-300 mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-6 rounded bg-dark-700 block" /> {machine.location}
                                        </p>

                                        {/* Stock Meter */}
                                        <div className="mb-5 bg-dark-800/50 p-4 rounded-xl border border-dark-700/50">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-medium text-dark-400 flex items-center gap-1.5">
                                                    <Pill className="w-3.5 h-3.5" /> Internal Stock Level
                                                </span>
                                                <span className={`text-sm font-bold font-mono ${
                                                    machine.stockPct > 60 ? 'text-emerald-400' : 
                                                    machine.stockPct > 30 ? 'text-amber-400' : 'text-rose-400'
                                                }`}>{machine.stockPct}%</span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-dark-900 overflow-hidden shadow-inner flex border border-dark-900">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${machine.stockPct}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                                    className="h-full relative overflow-hidden"
                                                    style={{ 
                                                        background: machine.stockPct > 60 ? 'linear-gradient(90deg, #059669, #10B981)' : 
                                                                   machine.stockPct > 30 ? 'linear-gradient(90deg, #D97706, #F59E0B)' : 
                                                                   'linear-gradient(90deg, #E11D48, #F43F5E)'
                                                    }}
                                                >
                                                    {/* Shine effect overlay */}
                                                    <motion.div 
                                                        className="absolute inset-0 w-full h-full"
                                                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                                                        animate={{ x: ['-100%', '200%'] }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                    />
                                                </motion.div>
                                            </div>
                                            {machine.stockPct < 30 && (
                                                <p className="text-[10px] text-rose-400 mt-2 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Minimum threshold reached. Refill required.
                                                </p>
                                            )}
                                        </div>

                                        {/* Mini stats */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-dark-800/30 rounded-lg p-2.5 flex flex-col justify-between">
                                                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Cpu className="w-3 h-3" /> Ping</p>
                                                <p className="text-xs text-white font-medium">{machine.lastPing}</p>
                                            </div>
                                            <div className="bg-dark-800/30 rounded-lg p-2.5 flex flex-col justify-between border-x border-dark-700/30">
                                                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Dispensed</p>
                                                <p className="text-xs text-white font-medium">{machine.itemsDispensed}</p>
                                            </div>
                                            <div className="bg-dark-800/30 rounded-lg p-2.5 flex flex-col justify-between">
                                                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Errors</p>
                                                <p className={`text-xs font-semibold ${machine.errors > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{machine.errors === 0 ? 'None' : machine.errors}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer actions */}
                                    <div className="p-4 border-t border-dark-700/50 bg-dark-800/20 flex gap-3 backdrop-blur-sm">
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="flex-1 font-mono text-xs"
                                            onClick={() => handlePing(machine.id)}
                                            disabled={isOffline}
                                        >
                                            Fetch Diagnostics
                                        </Button>
                                        {(machine.stockPct < 30 || isMaintenance) && (
                                            <Button 
                                                size="sm" 
                                                variant="danger"
                                                className="flex-1 text-xs shadow-lg shadow-rose-500/20"
                                                icon={Send}
                                                onClick={() => handleRefillAlert(machine.id)}
                                            >
                                                Alert Tech
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </AnimatedPage>
    )
}

function CheckCircleIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    )
}
