import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pill, Zap, Shield, Brain, ArrowRight } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => navigate('/login'), 300)
                    return 100
                }
                return prev + 4
            })
        }, 100)
        return () => clearInterval(interval)
    }, [navigate])

    const features = [
        { icon: Brain, label: 'AI Scanning', color: 'from-primary-500 to-blue-600' },
        { icon: Zap, label: 'Instant Dispense', color: 'from-amber-500 to-orange-600' },
        { icon: Shield, label: 'Doctor Verified', color: 'from-emerald-500 to-green-600' },
        { icon: Pill, label: 'Smart Inventory', color: 'from-purple-500 to-violet-600' },
    ]

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Dot Pattern Background */}
            <div className="absolute inset-0 dot-pattern opacity-30" />

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

            {/* Logo Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 text-center"
            >
                {/* Icon */}
                <motion.div
                    animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 60px rgba(59,130,246,0.5)', '0 0 20px rgba(59,130,246,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"
                >
                    <Pill className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black tracking-tight mb-4"
                >
                    <span className="text-gradient">MEDI</span>
                    <span className="text-white">KIOSK</span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-dark-400 font-medium mb-12"
                >
                    AI-Powered Smart Medicine Dispensing
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {features.map((feat, i) => (
                        <motion.div
                            key={feat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-900/60 border border-dark-700/50 backdrop-blur-sm"
                        >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${feat.color} flex items-center justify-center`}>
                                <feat.icon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-dark-300">{feat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="w-48 mx-auto"
                >
                    <div className="h-1 bg-dark-800 rounded-full overflow-hidden mb-3">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                    <p className="text-xs text-dark-500">Loading system...</p>
                </motion.div>
            </motion.div>

            {/* Floating Icons */}
            {[Pill, Shield, Zap, Brain].map((Icon, i) => (
                <motion.div
                    key={i}
                    className="absolute text-dark-700/30"
                    style={{
                        top: `${20 + i * 20}%`,
                        left: i % 2 === 0 ? '10%' : '85%',
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                >
                    <Icon className="w-8 h-8" />
                </motion.div>
            ))}
        </div>
    )
}
