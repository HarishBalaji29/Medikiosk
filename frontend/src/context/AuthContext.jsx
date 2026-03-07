import { createContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('medikiosk_token')
        if (token && !token.startsWith('demo-')) {
            fetchUser(token)
        } else {
            localStorage.removeItem('medikiosk_token')
            setLoading(false)
        }
    }, [])

    const fetchUser = async (token) => {
        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const res = await api.get('/auth/me')
            setUser(res.data)
        } catch {
            localStorage.removeItem('medikiosk_token')
            delete api.defaults.headers.common['Authorization']
        } finally {
            setLoading(false)
        }
    }

    /** Email/Password login (doctor, admin) */
    const login = useCallback(async (credentials) => {
        const res = await api.post('/auth/login', credentials)
        const { access_token, user: userData } = res.data
        localStorage.setItem('medikiosk_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setUser(userData)
        return userData
    }, [])

    /** Register new user */
    const register = useCallback(async (data) => {
        const res = await api.post('/auth/register', data)
        const { access_token, user: userData } = res.data
        localStorage.setItem('medikiosk_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setUser(userData)
        return userData
    }, [])

    /** Send OTP to phone number via Twilio */
    const sendOtp = useCallback(async (phone) => {
        const res = await api.post('/auth/send-otp', { phone })
        return res.data  // { message, mode, demo_otp? }
    }, [])

    /** Verify OTP and login */
    const verifyOtp = useCallback(async (phone, otp) => {
        const res = await api.post('/auth/verify-otp', { phone, otp })
        const { access_token, user: userData } = res.data
        localStorage.setItem('medikiosk_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setUser(userData)
        return userData
    }, [])

    /** Logout */
    const logout = useCallback(() => {
        localStorage.removeItem('medikiosk_token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{
            user, loading, login, register, logout,
            sendOtp, verifyOtp,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
