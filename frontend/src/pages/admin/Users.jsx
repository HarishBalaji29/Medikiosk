import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { Users as UsersIcon, Search, Shield, Stethoscope, User, Calendar, Mail, Inbox } from 'lucide-react'

const roleIcons = { patient: User, doctor: Stethoscope, admin: Shield }
const roleColors = { patient: 'from-primary-500 to-blue-600', doctor: 'from-emerald-500 to-green-600', admin: 'from-amber-500 to-orange-600' }

export default function Users() {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [usersData] = useState([])

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

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
                <p className="text-dark-400">View and manage system users</p>
            </div>

            {/* Role Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1"><Input icon={Search} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <div className="flex gap-2">
                    {['all', 'patient', 'doctor', 'admin'].map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${roleFilter === r ? 'bg-primary-500/10 border-primary-500/30 text-primary-400' : 'bg-dark-900 border-dark-700 text-dark-400 hover:text-white'}`}>
                            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)} ({roleCounts[r]})
                        </button>
                    ))}
                </div>
            </div>

            {/* User Table */}
            <Card variant="default" hover={false} className="!p-0 overflow-hidden">
                {filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700/50">
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">User</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Email</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">Role</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">Status</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, i) => {
                                    const RoleIcon = roleIcons[user.role] || User
                                    return (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[user.role] || 'from-dark-600 to-dark-700'} flex items-center justify-center text-sm font-bold text-white`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-dark-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-dark-800 border border-dark-700 text-dark-300 capitalize">
                                                    <RoleIcon className="w-3 h-3" /> {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={user.status === 'active' ? 'success' : 'offline'} label={user.status} />
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-sm text-dark-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {user.joined}</span>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                        <p className="text-dark-400 font-medium">No users found</p>
                        <p className="text-xs text-dark-500 mt-1">Users will appear here when they register</p>
                    </div>
                )}
            </Card>
        </AnimatedPage>
    )
}
