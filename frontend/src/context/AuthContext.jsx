import { createContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('medikiosk_token')
        if (token) {
            fetchUser(token)
        } else {
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

    const login = useCallback(async (credentials) => {
        const res = await api.post('/auth/login', credentials)
        const { access_token, user: userData } = res.data
        localStorage.setItem('medikiosk_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setUser(userData)
        return userData
    }, [])

    const register = useCallback(async (data) => {
        const res = await api.post('/auth/register', data)
        const { access_token, user: userData } = res.data
        localStorage.setItem('medikiosk_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setUser(userData)
        return userData
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('medikiosk_token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
    }, [])

    const demoLogin = useCallback((role) => {
        const demoUsers = {
            patient: { id: 1, name: 'Rahul Sharma', email: 'patient@demo.com', role: 'patient', phone: '+91 98765 43210' },
            doctor: { id: 2, name: 'Dr. Priya Patel', email: 'doctor@demo.com', role: 'doctor', specialization: 'General Medicine' },
            admin: { id: 3, name: 'Admin User', email: 'admin@demo.com', role: 'admin' },
        }
        const userData = demoUsers[role]
        localStorage.setItem('medikiosk_token', 'demo-token-' + role)
        setUser(userData)
        return userData
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}
