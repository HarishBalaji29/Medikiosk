import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import AnimatedPage from '../../components/shared/AnimatedPage'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { User, Phone, Mail, Save, Clock, ShieldCheck, HeartPulse, QrCode } from 'lucide-react'

export default function PatientProfile() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    const handleSave = (e) => {
        e.preventDefault()
        setLoading(true)
        setSuccess('')
        setTimeout(() => {
            setLoading(false)
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        }, 1000)
    }

    // Mock patient properties for a "premium" feel
    const bloodType = "O+"
    const memberId = `MK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    return (
        <AnimatedPage>
            <div className="mb-8">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-white mb-2">
                    My Profile
                </motion.h1>
                <p className="text-dark-400">View your virtual Medical ID and manage your information</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* ── Virtual Medical ID Card ── */}
                <div className="xl:col-span-1 flex justify-center xl:justify-start">
                    <motion.div 
                        initial={{ opacity: 0, rotateY: -10, y: 20 }}
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        whileHover={{ scale: 1.02, rotateY: 5 }}
                        className="w-full max-w-[360px] h-[520px] rounded-[32px] p-1 relative overflow-hidden group perspective-1000"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 100%)' }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <div className="w-full h-full rounded-[28px] bg-dark-900 border border-dark-700/50 flex flex-col relative overflow-hidden shadow-2xl">
                            {/* Card Header Pattern */}
                            <div className="h-32 w-full bg-gradient-to-r from-primary-600 to-blue-600 relative overflow-hidden p-6 flex justify-between items-start">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                <div>
                                    <h3 className="text-white font-bold text-lg tracking-wide">MediKiosk</h3>
                                    <p className="text-primary-100 text-[10px] uppercase font-bold tracking-widest mt-0.5">Medical ID</p>
                                </div>
                                <ShieldCheck className="w-8 h-8 text-white opacity-80" />
                            </div>

                            {/* Avatar */}
                            <div className="absolute top-[80px] left-6 w-20 h-20 rounded-2xl bg-dark-800 border-4 border-dark-900 shadow-xl flex items-center justify-center text-3xl font-bold text-white z-10 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20" />
                                <span className="relative z-10">{(user?.name || 'P').charAt(0)}</span>
                            </div>

                            <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
                                <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                                <p className="text-dark-400 text-sm font-medium mb-6">Patient Member</p>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <p className="text-[10px] text-dark-500 uppercase tracking-widest font-semibold mb-1">Member ID</p>
                                        <p className="font-mono text-sm text-dark-200 tracking-wider bg-dark-800/50 py-1.5 px-3 rounded-lg border border-dark-700/50 w-fit">{memberId}</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-[10px] text-dark-500 uppercase tracking-widest font-semibold mb-1">Blood</p>
                                            <p className="text-rose-400 font-bold flex items-center gap-1.5">
                                                <HeartPulse className="w-4 h-4" /> {bloodType}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-dark-500 uppercase tracking-widest font-semibold mb-1">Joined</p>
                                            <p className="text-white text-sm font-medium">2023</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer border & QR */}
                                <div className="mt-auto pt-4 border-t border-dark-800 flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                        <Clock className="w-3.5 h-3.5" /> Active Status
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shadow-lg">
                                       <QrCode className="w-full h-full text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Settings Form ── */}
                <div className="xl:col-span-2">
                    <Card variant="glass" className="h-full">
                        <form onSubmit={handleSave} className="flex flex-col h-full">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-1">Account Details</h3>
                                <p className="text-xs text-dark-400">Update your personal information</p>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        label="Full Name"
                                        icon={User}
                                        defaultValue={user?.name}
                                        readOnly
                                    />
                                    <Input
                                        label="Account Role"
                                        icon={ShieldCheck}
                                        defaultValue={user?.role?.toUpperCase()}
                                        readOnly
                                        className="opacity-70 font-medium"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        label="Mobile Number"
                                        icon={Phone}
                                        defaultValue={user?.phone || '+91 98765 43210'} // Placeholder for demo
                                    />
                                    <Input
                                        label="Email Address"
                                        icon={Mail}
                                        defaultValue={user?.email || 'Not provided'}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-5 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-dark-500">
                                    Some fields are locked. Contact support to change them.
                                </p>
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <AnimatePresence>
                                        {success && (
                                            <motion.span 
                                                initial={{ opacity: 0, x: 10, scale: 0.9 }} 
                                                animate={{ opacity: 1, x: 0, scale: 1 }} 
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="text-sm font-medium text-emerald-400 flex items-center gap-1"
                                            >
                                                {success}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <Button type="submit" loading={loading} icon={Save} className="w-full sm:w-auto min-w-[140px]">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AnimatedPage>
    )
}
