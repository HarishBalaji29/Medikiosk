import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Package, Monitor, Users, AlertTriangle, TrendingUp,
    ArrowUpRight, ArrowDownRight, Activity, Pill,
    Plus, FileText, BarChart3, Clock
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'

const lowStockAlerts = [
    { name: 'Amoxicillin 500mg', stock: 5, threshold: 20 },
    { name: 'Metformin 500mg', stock: 8, threshold: 25 },
    { name: 'Cetirizine 10mg', stock: 0, threshold: 15 },
]

const recentActivity = [
    { text: 'Dispensed 14x Amoxicillin to Rahul Sharma', time: '5 min ago', type: 'success' },
    { text: 'Low stock alert: Cetirizine 10mg', time: '12 min ago', type: 'warning' },
    { text: 'Machine MK-003 went offline', time: '30 min ago', type: 'error' },
    { text: 'New user registered: Ananya Iyer', time: '1 hr ago', type: 'info' },
    { text: 'Dr. Patel approved 3 prescriptions', time: '2 hr ago', type: 'success' },
]

export default function AdminDashboard() {
    const navigate = useNavigate()

    const stats = [
        { label: 'Total Users', value: '2,847', icon: Users, change: '+12%', up: true, color: 'from-primary-500 to-blue-600' },
        { label: 'Active Machines', value: '14/16', icon: Monitor, change: '87.5%', up: true, color: 'from-emerald-500 to-green-600' },
        { label: 'Low Stock Items', value: '3', icon: AlertTriangle, change: '+1', up: false, color: 'from-amber-500 to-orange-600' },
        { label: "Today's Dispensing", value: '142', icon: Activity, change: '+28%', up: true, color: 'from-purple-500 to-violet-600' },
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
                                <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
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
                    <div className="space-y-3">
                        {lowStockAlerts.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.stock === 0 ? 'bg-rose-500/20' : 'bg-amber-500/10'}`}>
                                        <Pill className={`w-4 h-4 ${item.stock === 0 ? 'text-rose-400' : 'text-amber-400'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                        <p className="text-xs text-dark-400">Min: {item.threshold}</p>
                                    </div>
                                </div>
                                <StatusBadge
                                    status={item.stock === 0 ? 'error' : 'warning'}
                                    label={item.stock === 0 ? 'Out' : `${item.stock} left`}
                                />
                            </motion.div>
                        ))}
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
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex gap-3 p-2"
                            >
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'success' ? 'bg-emerald-400' :
                                        item.type === 'warning' ? 'bg-amber-400' :
                                            item.type === 'error' ? 'bg-rose-400' : 'bg-primary-400'
                                    }`} />
                                <div>
                                    <p className="text-sm text-dark-300">{item.text}</p>
                                    <p className="text-xs text-dark-500 mt-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {item.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
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

                {/* Machine Activity Chart Placeholder */}
                <Card variant="default" hover={false} className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-400" />
                            Machine Activity — Today
                        </h3>
                        <span className="text-xs text-dark-400">24-hour view</span>
                    </div>
                    <div className="flex items-end gap-1 h-32">
                        {[30, 45, 60, 80, 55, 70, 90, 85, 75, 65, 50, 40, 35, 55, 70, 85, 95, 80, 60, 45, 35, 25, 20, 15].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + i * 0.03, duration: 0.5 }}
                                className={`flex-1 rounded-t ${i >= 6 && i <= 17 ? 'bg-gradient-to-t from-primary-600 to-primary-400' : 'bg-dark-700'}`}
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
