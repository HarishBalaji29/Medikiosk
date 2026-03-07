import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
    Pill, Phone, Stethoscope, Shield, User,
    ArrowRight, Mail, Lock, Hash,
    Eye, EyeOff, ChevronLeft, AlertCircle, CheckCircle2
} from 'lucide-react'

const loginMethods = [
    { id: 'patient', icon: Phone, label: 'Patient Login', desc: 'Login with your mobile number via OTP', color: 'from-primary-500 to-blue-600', role: 'patient' },
    { id: 'doctor', icon: Stethoscope, label: 'Doctor Login', desc: 'Medical professional access', color: 'from-emerald-500 to-green-600', role: 'doctor' },
    { id: 'admin', icon: Shield, label: 'Admin Login', desc: 'System administration', color: 'from-amber-500 to-orange-600', role: 'admin' },
]

export default function Login() {
    const navigate = useNavigate()
    const { login, sendOtp, verifyOtp, register } = useAuth()
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isRegister, setIsRegister] = useState(false)

    // Form states
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [specialization, setSpecialization] = useState('')

    const resetForm = () => {
        setOtpSent(false)
        setError('')
        setSuccess('')
        setPhone('')
        setOtp('')
        setName('')
        setEmail('')
        setPassword('')
        setSpecialization('')
        setIsRegister(false)
    }

    // ─── Patient: Send OTP via Twilio ───
    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number with country code (e.g. +919345789116)')
            return
        }
        setLoading(true)
        setError('')
        try {
            const phoneNum = phone.startsWith('+') ? phone : `+91${phone}`
            const result = await sendOtp(phoneNum)
            setOtpSent(true)
            if (result.mode === 'simulated' && result.demo_otp) {
                setSuccess(`OTP sent! (Test mode — OTP: ${result.demo_otp})`)
            } else {
                setSuccess(`OTP sent to ${phoneNum} via SMS`)
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // ─── Patient: Verify OTP ───
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter the 6-digit OTP')
            return
        }
        setLoading(true)
        setError('')
        try {
            const phoneNum = phone.startsWith('+') ? phone : `+91${phone}`
            const userData = await verifyOtp(phoneNum, otp)
            setSuccess('Login successful!')
            setTimeout(() => navigate(`/${userData.role}/dashboard`), 500)
        } catch (err) {
            const detail = err.response?.data?.detail || 'Invalid or expired OTP'
            setError(detail)
        } finally {
            setLoading(false)
        }
    }

    // ─── Doctor/Admin: Email+Password Login ───
    const handleEmailLogin = async (role) => {
        if (!email || !password) {
            setError('Please enter both email and password')
            return
        }
        setLoading(true)
        setError('')
        try {
            const userData = await login({ email, password })
            if (userData.role !== role) {
                setError(`This account is registered as "${userData.role}", not "${role}"`)
                setLoading(false)
                return
            }
            setSuccess('Login successful!')
            setTimeout(() => navigate(`/${userData.role}/dashboard`), 500)
        } catch (err) {
            const detail = err.response?.data?.detail || 'Invalid email or password'
            setError(detail)
        } finally {
            setLoading(false)
        }
    }

    // ─── Doctor/Admin: Register ───
    const handleRegister = async (role) => {
        if (!name || !email || !password) {
            setError('Please fill in all required fields')
            return
        }
        setLoading(true)
        setError('')
        try {
            const userData = await register({
                name,
                email,
                password,
                phone: phone || undefined,
                role,
                specialization: role === 'doctor' ? specialization : undefined,
            })
            setSuccess('Account created successfully!')
            setTimeout(() => navigate(`/${userData.role}/dashboard`), 500)
        } catch (err) {
            const detail = err.response?.data?.detail || 'Registration failed'
            setError(detail)
        } finally {
            setLoading(false)
        }
    }

    const renderForm = () => {
        switch (selectedMethod) {
            case 'patient':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">📱 Patient OTP Login</h3>

                        {!otpSent ? (
                            <>
                                <Input
                                    label="Mobile Number"
                                    icon={Phone}
                                    placeholder="+91XXXXXXXXXX"
                                    value={phone}
                                    onChange={e => { setPhone(e.target.value); setError('') }}
                                />
                                <p className="text-xs text-dark-400">Include country code (e.g. +91 for India)</p>
                                <Button onClick={handleSendOtp} loading={loading} className="w-full" size="lg" icon={ArrowRight}>
                                    Send OTP
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-dark-400">
                                    OTP sent to <span className="text-primary-400">{phone}</span>
                                </p>
                                <Input
                                    label="Enter OTP"
                                    icon={Hash}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    value={otp}
                                    onChange={e => { setOtp(e.target.value); setError('') }}
                                />
                                <Button onClick={handleVerifyOtp} loading={loading} className="w-full" size="lg" icon={ArrowRight}>
                                    Verify & Login
                                </Button>
                                <button onClick={() => { setOtpSent(false); setError(''); setSuccess('') }} className="text-sm text-primary-400 hover:underline">
                                    Change number / Resend OTP
                                </button>
                            </>
                        )}
                    </motion.div>
                )

            case 'doctor':
            case 'admin':
                const role = selectedMethod
                const roleLabel = role === 'doctor' ? '👨‍⚕️ Doctor' : '🔑 Admin'
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{roleLabel} {isRegister ? 'Register' : 'Login'}</h3>

                        {isRegister && (
                            <Input
                                label="Full Name"
                                icon={User}
                                placeholder={role === 'doctor' ? 'Dr. Full Name' : 'Admin Name'}
                                value={name}
                                onChange={e => { setName(e.target.value); setError('') }}
                            />
                        )}

                        <Input
                            label="Email"
                            icon={Mail}
                            type="email"
                            placeholder={role === 'doctor' ? 'doctor@hospital.com' : 'admin@medikiosk.com'}
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError('') }}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError('') }}
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-dark-500 hover:text-dark-300">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {isRegister && role === 'doctor' && (
                            <Input
                                label="Specialization"
                                icon={Stethoscope}
                                placeholder="e.g. General Medicine"
                                value={specialization}
                                onChange={e => setSpecialization(e.target.value)}
                            />
                        )}

                        {isRegister && (
                            <Input
                                label="Phone (optional)"
                                icon={Phone}
                                placeholder="+91XXXXXXXXXX"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        )}

                        <Button
                            onClick={() => isRegister ? handleRegister(role) : handleEmailLogin(role)}
                            loading={loading}
                            className="w-full"
                            size="lg"
                            variant={role === 'doctor' ? 'emerald' : 'default'}
                            icon={ArrowRight}
                        >
                            {isRegister ? `Create ${role} Account` : `Login as ${role}`}
                        </Button>

                        <button
                            onClick={() => { setIsRegister(!isRegister); setError('') }}
                            className="text-sm text-primary-400 hover:underline block text-center w-full"
                        >
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </button>
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {loginMethods.map((method, i) => (
                                <motion.button
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { setSelectedMethod(method.id); resetForm() }}
                                    className={`
                                        relative p-5 rounded-2xl border text-left transition-all duration-300
                                        ${selectedMethod === method.id
                                            ? 'border-primary-500/50 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                                            : 'border-dark-700/50 bg-dark-900/60 hover:border-dark-600'}
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
                    </div>

                    {/* Login Form Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-dark-900/60 border border-dark-700/50 rounded-2xl p-8 backdrop-blur-xl min-h-[380px] flex flex-col justify-center"
                    >
                        {/* Error / Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2"
                                >
                                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                    <p className="text-sm text-rose-300">{error}</p>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <p className="text-sm text-emerald-300">{success}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {selectedMethod ? (
                                <motion.div key={selectedMethod}>
                                    <button
                                        onClick={() => { setSelectedMethod(null); resetForm() }}
                                        className="flex items-center gap-1 text-sm text-dark-400 hover:text-white mb-4 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </button>
                                    {renderForm()}
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
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
