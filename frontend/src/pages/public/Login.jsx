import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
    Pill, Phone, Stethoscope, Shield, User,
    ArrowRight, Mail, Lock, Hash,
    Eye, EyeOff, ChevronLeft, AlertCircle, CheckCircle2,
    Sun, Moon
} from 'lucide-react'

const loginMethods = [
    { id: 'patient', icon: Phone, label: 'Patient Login', desc: 'Login with your mobile number via OTP', color: 'from-primary-500 to-blue-600', role: 'patient' },
    { id: 'doctor', icon: Stethoscope, label: 'Doctor Login', desc: 'Medical professional access', color: 'from-emerald-500 to-green-600', role: 'doctor' },
    { id: 'admin', icon: Shield, label: 'Admin Login', desc: 'System administration', color: 'from-amber-500 to-orange-600', role: 'admin' },
]

export default function Login() {
    const navigate = useNavigate()
    const { login, sendOtp, verifyOtp, register } = useAuth()
    const { isDark, toggleTheme } = useTheme()
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [authMode, setAuthMode] = useState('otp')
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
        if (!phone || phone.replace(/\D/g, '').length !== 10) {
            setError('Please enter a valid 10-digit mobile number')
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
            const userData = await verifyOtp(phoneNum, otp, name, selectedMethod)
            setSuccess('Login successful!')
            setTimeout(() => navigate(`/${userData.role}/dashboard`), 500)
        } catch (err) {
            const detail = err.response?.data?.detail || 'Invalid or expired OTP'
            setError(detail)
        } finally {
            setLoading(false)
        }
    }

    // ─── Email+Password Login ───
    const handleEmailLogin = async (role) => {
        if (!email || !password) {
            setError('Please enter both email and password')
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter the valid email id')
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

    // ─── Register ───
    const handleRegister = async (role) => {
        if (!name || !email || !password) {
            setError('Please fill in all required fields')
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter the valid email id')
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
        if (!selectedMethod) return null
        const role = selectedMethod
        const roleLabel = role === 'patient' ? '📱 Patient' : role === 'doctor' ? '👨‍⚕️ Doctor' : '🔑 Admin'
        const isOTP = authMode === 'otp'

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    {roleLabel} {isRegister ? 'Register' : 'Login'}
                </h3>

                {/* The Plate Button Toggle */}
                {!isRegister && (
                    <div className={`flex p-1 rounded-xl mb-4 ${isDark ? 'bg-dark-800' : 'bg-slate-200'}`}>
                        <button 
                            onClick={() => { setAuthMode('otp'); setError(''); }}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${authMode === 'otp' ? 'bg-primary-500 text-white shadow-md' : isDark ? 'text-dark-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Via OTP
                        </button>
                        <button 
                            onClick={() => { setAuthMode('email'); setError(''); }}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${authMode === 'email' ? 'bg-primary-500 text-white shadow-md' : isDark ? 'text-dark-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Via Email
                        </button>
                    </div>
                )}

                {isOTP ? (
                    // ─── OTP FLOW ───
                    !otpSent ? (
                        <>
                            <Input
                                label="Name (Optional)"
                                icon={User}
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => { setName(e.target.value); setError('') }}
                            />
                            <Input
                                label="Mobile Number"
                                icon={Phone}
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                value={phone}
                                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                                onKeyDown={e => { if (e.key === 'Enter' && !loading) handleSendOtp() }}
                            />
                            <Button onClick={handleSendOtp} loading={loading} className="w-full mt-2" size="lg" icon={ArrowRight}>
                                Send OTP
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className={`text-sm ${isDark ? 'text-dark-400' : 'text-slate-500'}`}>
                                OTP sent to <span className="text-primary-400">{phone}</span>
                            </p>
                            <Input
                                label="Enter OTP"
                                icon={Hash}
                                placeholder="6-digit code"
                                maxLength={6}
                                value={otp}
                                onChange={e => { setOtp(e.target.value); setError('') }}
                                onKeyDown={e => { if (e.key === 'Enter' && !loading) handleVerifyOtp() }}
                            />
                            <Button onClick={handleVerifyOtp} loading={loading} className="w-full mt-2" size="lg" icon={ArrowRight}>
                                Verify & Login
                            </Button>
                            <button onClick={() => { setOtpSent(false); setError(''); setSuccess('') }} className="text-sm text-primary-400 hover:underline">
                                Change number / Resend OTP
                            </button>
                        </>
                    )
                ) : (
                    // ─── EMAIL FLOW ───
                    <>
                        {isRegister && (
                            <Input
                                label="Full Name"
                                icon={User}
                                placeholder={role === 'doctor' ? 'Dr. Full Name' : 'Enter your name'}
                                value={name}
                                onChange={e => { setName(e.target.value); setError('') }}
                                onKeyDown={e => { if (e.key === 'Enter' && !loading) handleRegister(role) }}
                            />
                        )}

                        <Input
                            label="Email"
                            icon={Mail}
                            type="email"
                            placeholder={role === 'doctor' ? 'doctor@hospital.com' : 'user@medikiosk.com'}
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError('') }}
                            onKeyDown={e => { if (e.key === 'Enter' && !loading) isRegister ? handleRegister(role) : handleEmailLogin(role) }}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError('') }}
                                onKeyDown={e => { if (e.key === 'Enter' && !loading) isRegister ? handleRegister(role) : handleEmailLogin(role) }}
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
                                onKeyDown={e => { if (e.key === 'Enter' && !loading) handleRegister(role) }}
                            />
                        )}

                        {isRegister && (
                            <Input
                                label="Phone (optional)"
                                icon={Phone}
                                placeholder="+91XXXXXXXXXX"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !loading) handleRegister(role) }}
                            />
                        )}

                        <Button
                            onClick={() => isRegister ? handleRegister(role) : handleEmailLogin(role)}
                            loading={loading}
                            className="w-full mt-2"
                            size="lg"
                            variant={role === 'doctor' ? 'emerald' : role === 'admin' ? 'default' : 'default'}
                            icon={ArrowRight}
                        >
                            {isRegister ? `Create Account` : `Login as ${roleLabel.split(' ')[1]}`}
                        </Button>

                        <button
                            onClick={() => { setIsRegister(!isRegister); setError('') }}
                            className="text-sm text-primary-400 hover:underline block text-center w-full mt-1"
                        >
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register (Via Email)"}
                        </button>
                    </>
                )}
            </motion.div>
        )
    }

    return (
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden p-4 transition-colors duration-300 ${isDark ? '' : 'bg-slate-100'}`}>
            {/* Full-screen image background */}
            <img
                src="/login-bg.png"
                alt=""
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
                draggable={false}
            />
            {/* Dark/Light overlay for readability */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: isDark
                    ? 'linear-gradient(135deg, rgba(3,7,18,0.78) 0%, rgba(3,7,18,0.60) 50%, rgba(3,7,18,0.78) 100%)'
                    : 'linear-gradient(135deg, rgba(240,245,255,0.85) 0%, rgba(240,245,255,0.70) 50%, rgba(240,245,255,0.85) 100%)',
                zIndex: 1,
                transition: 'background 0.3s ease',
            }} />

            <div className="relative w-full max-w-3xl" style={{ zIndex: 2 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-glow-pulse">
                            <Pill className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">
                            <span className="text-gradient">MEDI</span>
                            <span className={isDark ? 'text-white' : 'text-slate-800'}>KIOSK</span>
                        </h1>
                    </div>
                    <p className={isDark ? 'text-dark-400' : 'text-slate-600'}>Select your login method to continue</p>
                </motion.div>

                {/* Centered Login Method Cards */}
                <div className="flex justify-center gap-4 mb-8">
                    {loginMethods.map((method, i) => (
                        <motion.button
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            whileHover={{ scale: 1.04, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setSelectedMethod(method.id); resetForm() }}
                            className={`
                                relative p-6 rounded-2xl border text-left transition-all duration-300 w-44
                                ${selectedMethod === method.id
                                    ? 'border-primary-500/60 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                                    : isDark
                                        ? 'border-white/15 bg-dark-900/30 hover:border-white/30 hover:bg-dark-900/50'
                                        : 'border-slate-300/60 bg-white/60 hover:border-slate-400 hover:bg-white/80'
                                }
                            `}
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4`}>
                                <method.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-1`}>{method.label}</h3>
                            <p className={`text-xs ${isDark ? 'text-dark-400' : 'text-slate-500'} leading-snug`}>{method.desc}</p>
                            {selectedMethod === method.id && (
                                <motion.div layoutId="selector" className="absolute inset-0 rounded-2xl border-2 border-primary-500/50" />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Login Form — appears below cards when a method is selected */}
                <AnimatePresence mode="wait">
                    {selectedMethod && (
                        <motion.div
                            key={selectedMethod}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25 }}
                        className={`${isDark ? 'bg-dark-900/30 border-white/10' : 'bg-white/70 border-slate-200/80'} border rounded-2xl p-8 backdrop-blur-md`}
                            style={{ backdropFilter: 'blur(12px)' }}
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

                            <button
                                onClick={() => { setSelectedMethod(null); resetForm() }}
                                className={`flex items-center gap-1 text-sm ${isDark ? 'text-dark-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} mb-5 transition-colors`}
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                            {renderForm()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
