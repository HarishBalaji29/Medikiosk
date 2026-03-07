import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Package, Monitor, Users, AlertTriangle, TrendingUp,
    ArrowUpRight, ArrowDownRight, Activity, Pill,
    Plus, FileText, BarChart3, Clock, Inbox
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const navigate = useNavigate()

    const stats = [
        { label: 'Total Users', value: '0', icon: Users, change: '—', up: true, color: 'from-primary-500 to-blue-600' },
        { label: 'Active Machines', value: '0', icon: Monitor, change: '—', up: true, color: 'from-emerald-500 to-green-600' },
        { label: 'Low Stock Items', value: '0', icon: AlertTriangle, change: '—', up: false, color: 'from-amber-500 to-orange-600' },
        { label: "Today's Dispensing", value: '0', icon: Activity, change: '—', up: true, color: 'from-purple-500 to-violet-600' },
    ]

    const quickActions = [
        { label: 'Add Medicine', icon: Plus, path: '/admin/inventory' },
        { label: 'View Machines', icon: Monitor, path: '/admin/machines' },
        { label: 'View Reports', icon: BarChart3, path: '/admin/dashboard' },
        { label: 'Manage Users', icon: Users, path: '/admin/users' },
    ]

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-dark-400">System overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card variant="glass" hover={false} className="!p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Low Stock Alerts */}
                <Card variant="default" hover={false} className="lg:col-span-1 !border-amber-500/20">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Low Stock Alerts
                    </h3>
                    <div className="text-center py-6">
                        <Package className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                        <p className="text-sm text-dark-400">No stock alerts</p>
                        <p className="text-xs text-dark-500 mt-1">Add medicines to inventory to track stock</p>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => navigate('/admin/inventory')}>
                        Manage Inventory
                    </Button>
                </Card>

                {/* Activity Feed */}
                <Card variant="glass" hover={false} className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-primary-400" />
                        Recent Activity
                    </h3>
                    <div className="text-center py-6">
                        <Inbox className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                        <p className="text-sm text-dark-400">No recent activity</p>
                        <p className="text-xs text-dark-500 mt-1">Activity will appear as users interact with the system</p>
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card variant="glass" hover={false}>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, i) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(action.path)}
                                className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:border-primary-500/30 transition-all text-center"
                            >
                                <action.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                                <span className="text-xs font-medium text-dark-300">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </Card>

                {/* Machine Activity Chart */}
                <Card variant="default" hover={false} className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-400" />
                            Machine Activity — Today
                        </h3>
                        <span className="text-xs text-dark-400">24-hour view</span>
                    </div>
                    <div className="flex items-end gap-1 h-32">
                        {Array(24).fill(0).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: '5%' }}
                                transition={{ delay: 0.5 + i * 0.03, duration: 0.5 }}
                                className="flex-1 rounded-t bg-dark-700"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-dark-500">
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>Now</span>
                    </div>
                </Card>
            </div>
        </AnimatedPage>
    )
}
