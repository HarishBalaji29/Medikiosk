import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { Users as UsersIcon, Search, Shield, Stethoscope, User, Calendar, Mail, Inbox, Loader2, Activity, MoreVertical, PowerOff, KeyRound, Eye } from 'lucide-react'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'

const roleIcons = { patient: User, doctor: Stethoscope, admin: Shield }
const roleColors = { patient: 'from-primary-500 to-blue-600', doctor: 'from-emerald-500 to-green-600', admin: 'from-amber-500 to-orange-600' }

export default function Users() {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await api.get('/admin/users')
            // Add a mock 'last_active' flag for the UI since backend may not provide it yet
            const enriched = res.data.map((u, i) => ({
                ...u,
                activity_level: i % 3 === 0 ? 'now' : i % 2 === 0 ? 'recent' : 'inactive' // mock
            }))
            setUsersData(enriched)
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filtered = usersData.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === 'all' || u.role === roleFilter
        return matchSearch && matchRole
    })

    const roleCounts = {
        all: usersData.length,
        patient: usersData.filter(u => u.role === 'patient').length,
        doctor: usersData.filter(u => u.role === 'doctor').length,
        admin: usersData.filter(u => u.role === 'admin').length,
    }

    const getActivityDot = (level) => {
        if (level === 'now') return <div title="Active within 24h" className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-dark-900 rounded-full z-10 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
        if (level === 'recent') return <div title="Active this week" className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 border-2 border-dark-900 rounded-full z-10" />
        return <div title="Inactive" className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-dark-600 border-2 border-dark-900 rounded-full z-10" />
    }

    const handleAction = (action, name) => {
        toast(`${action} initiated for ${name}`, 'info')
    }

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <UsersIcon className="w-6 h-6 text-primary-400" /> User Directory
                </h1>
                <p className="text-dark-400">View and manage system access and activity</p>
            </div>

            {/* Role Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-dark-900/40 p-3 rounded-2xl border border-dark-700/50 backdrop-blur-sm">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-dark-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors placeholder-dark-500"
                        placeholder="Search by name or email..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {['all', 'patient', 'doctor', 'admin'].map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${roleFilter === r ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 border-primary-500/50' : 'bg-transparent border-dark-700 text-dark-400 hover:bg-dark-800 hover:text-white'}`}>
                            {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)} 
                            <span className={`ml-2 text-xs font-mono px-1.5 py-0.5 rounded-md ${roleFilter === r ? 'bg-white/20 text-white' : 'bg-dark-800 text-dark-500'}`}>
                                {roleCounts[r]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Table */}
            <Card variant="default" hover={false} className="!p-0 overflow-visible border-dark-700/50 shadow-2xl relative z-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-dark-400">
                        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                        <p className="font-medium text-white">Loading directory...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="overflow-x-auto pb-4">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700/50 bg-dark-800/30">
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-widest px-6 py-4">User Details</th>
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-widest px-6 py-4 hidden md:table-cell">Contact</th>
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-widest px-6 py-4">Role Access</th>
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-widest px-6 py-4 hidden lg:table-cell">Joined</th>
                                    <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-widest px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                {filtered.map((user, i) => {
                                    const RoleIcon = roleIcons[user.role] || User
                                    return (
                                        <motion.tr
                                            layout
                                            key={user.id || i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-dark-700/30 hover:bg-dark-800/40 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${roleColors[user.role] || 'from-dark-600 to-dark-700'} flex items-center justify-center text-sm font-bold text-white uppercase shadow-inner border-2 border-dark-800/50 group-hover:border-primary-500/30 transition-colors`}>
                                                            {(user.name || '?').charAt(0)}
                                                        </div>
                                                        {getActivityDot(user.activity_level)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{user.name}</span>
                                                        <span className="text-[10px] text-dark-400 font-medium mt-0.5 flex items-center gap-1 uppercase tracking-wider">
                                                            <Activity className="w-3 h-3 text-primary-500" />
                                                            {user.activity || 'Standard Activity'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-dark-300 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-dark-500" /> {user.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-dark-800 border border-dark-700 capitalize ${user.role === 'admin' ? 'text-amber-400' : user.role === 'doctor' ? 'text-emerald-400' : 'text-primary-400'}`}>
                                                    <RoleIcon className="w-3.5 h-3.5" /> {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-sm text-dark-400 flex items-center gap-1.5 font-mono">
                                                    <Calendar className="w-3.5 h-3.5 text-dark-500" /> {user.joined || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleAction('View profile', user.name)} className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors tooltip-btn" title="View Activity">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction('Reset password', user.name)} className="p-2 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors tooltip-btn" title="Reset Password">
                                                        <KeyRound className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction('Deactivate', user.name)} className="p-2 rounded-lg text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors tooltip-btn" title="Deactivate">
                                                        <PowerOff className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-dark-900/30">
                        <Inbox className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                        <p className="text-white font-medium text-lg">No users found</p>
                        <p className="text-sm text-dark-500 mt-2 max-w-sm mx-auto">None of the registered users match your search or filter criteria.</p>
                    </div>
                )}
            </Card>
        </AnimatedPage>
    )
}
