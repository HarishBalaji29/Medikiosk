import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
    Pill, Phone, CreditCard, Stethoscope, Shield,
    AlertTriangle, ArrowRight, Mail, Lock, Hash,
    Eye, EyeOff, ChevronLeft
} from 'lucide-react'

const loginMethods = [
    { id: 'mobile', icon: Phone, label: 'Mobile OTP', desc: 'Login with your phone number', color: 'from-primary-500 to-blue-600', role: 'patient' },
    { id: 'patient-id', icon: CreditCard, label: 'Patient ID', desc: 'Use your patient ID card', color: 'from-emerald-500 to-green-600', role: 'patient' },
    { id: 'doctor', icon: Stethoscope, label: 'Doctor Login', desc: 'Medical professional access', color: 'from-purple-500 to-violet-600', role: 'doctor' },
    { id: 'admin', icon: Shield, label: 'Admin Login', desc: 'System administration', color: 'from-amber-500 to-orange-600', role: 'admin' },
]

export default function Login() {
    const navigate = useNavigate()
    const { demoLogin } = useAuth()
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form states
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [patientId, setPatientId] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (role) => {
        setLoading(true)
        // Simulate API call
        await new Promise(r => setTimeout(r, 800))
        demoLogin(role)
        setLoading(false)
        navigate(`/${role}/dashboard`)
    }

    const handleSendOtp = () => {
        setOtpSent(true)
    }

    const handleEmergency = () => {
        demoLogin('patient')
        navigate('/patient/upload')
    }

    const renderForm = () => {
        switch (selectedMethod) {
            case 'mobile':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">📱 Mobile OTP Login</h3>
                        {!otpSent ? (
                            <>
                                <Input label="Mobile Number" icon={Phone} placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
                                <Button onClick={handleSendOtp} className="w-full" size="lg" icon={ArrowRight}>Send OTP</Button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-dark-400">OTP sent to <span className="text-primary-400">{phone || '+91 98765 43210'}</span></p>
                                <Input label="Enter OTP" icon={Hash} placeholder="6-digit code" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} />
                                <Button onClick={() => handleLogin('patient')} loading={loading} className="w-full" size="lg" icon={ArrowRight}>Verify & Login</Button>
                                <button onClick={() => setOtpSent(false)} className="text-sm text-primary-400 hover:underline">Resend OTP</button>
                            </>
                        )}
                    </motion.div>
                )
            case 'patient-id':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">🏥 Patient ID Login</h3>
                        <Input label="Patient ID" icon={CreditCard} placeholder="PAT-2026-XXXX" value={patientId} onChange={e => setPatientId(e.target.value)} />
                        <div className="relative">
                            <Input label="Password" icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-dark-500 hover:text-dark-300">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <Button onClick={() => handleLogin('patient')} loading={loading} className="w-full" size="lg" icon={ArrowRight}>Login</Button>
                    </motion.div>
                )
            case 'doctor':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">👨‍⚕️ Doctor Login</h3>
                        <Input label="Email" icon={Mail} type="email" placeholder="doctor@hospital.com" value={email} onChange={e => setEmail(e.target.value)} />
                        <div className="relative">
                            <Input label="Password" icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-dark-500 hover:text-dark-300">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <Button onClick={() => handleLogin('doctor')} loading={loading} className="w-full" size="lg" variant="emerald" icon={ArrowRight}>Login as Doctor</Button>
                    </motion.div>
                )
            case 'admin':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">🔑 Admin Login</h3>
                        <Input label="Admin Email" icon={Mail} type="email" placeholder="admin@medikiosk.com" value={email} onChange={e => setEmail(e.target.value)} />
                        <div className="relative">
                            <Input label="Password" icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-dark-500 hover:text-dark-300">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <Button onClick={() => handleLogin('admin')} loading={loading} size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 rounded-xl transition-all" icon={ArrowRight}>Login as Admin</Button>
                    </motion.div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden p-4">
            {/* Background */}
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-glow-pulse">
                            <Pill className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">
                            <span className="text-gradient">MEDI</span>
                            <span className="text-white">KIOSK</span>
                        </h1>
                    </div>
                    <p className="text-dark-400">Select your login method to continue</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Login Method Cards */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {loginMethods.map((method, i) => (
                                <motion.button
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { setSelectedMethod(method.id); setOtpSent(false) }}
                                    className={`
                    relative p-5 rounded-2xl border text-left transition-all duration-300
                    ${selectedMethod === method.id
                                            ? 'border-primary-500/50 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                                            : 'border-dark-700/50 bg-dark-900/60 hover:border-dark-600'
                                        }
                  `}
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3`}>
                                        <method.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white mb-1">{method.label}</h3>
                                    <p className="text-xs text-dark-400">{method.desc}</p>
                                    {selectedMethod === method.id && (
                                        <motion.div layoutId="selector" className="absolute inset-0 rounded-2xl border-2 border-primary-500/40" />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Emergency Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleEmergency}
                            className="w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-500/15 transition-all flex items-center gap-3 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-semibold text-rose-400">Emergency Access</h3>
                                <p className="text-xs text-dark-400">Skip login for urgent dispensing</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-rose-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </div>

                    {/* Login Form Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-dark-900/60 border border-dark-700/50 rounded-2xl p-8 backdrop-blur-xl min-h-[320px] flex flex-col justify-center"
                    >
                        <AnimatePresence mode="wait">
                            {selectedMethod ? (
                                <motion.div key={selectedMethod}>
                                    <button
                                        onClick={() => setSelectedMethod(null)}
                                        className="flex items-center gap-1 text-sm text-dark-400 hover:text-white mb-4 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </button>
                                    {renderForm()}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center">
                                        <ArrowRight className="w-6 h-6 text-dark-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-dark-400 mb-2">Select a login method</h3>
                                    <p className="text-sm text-dark-500">Choose from the options on the left to continue</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
