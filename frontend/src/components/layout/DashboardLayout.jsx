import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import {
    LayoutDashboard, Pill, Upload, History, User, Users,
    Package, Monitor, LogOut, Menu, X, Activity,
    FileText, ChevronRight, Bell, Search, Settings
} from 'lucide-react'

const navItems = {
    patient: [
        { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/patient/upload', icon: Upload, label: 'Scan Prescription' },
        { path: '/patient/history', icon: History, label: 'History' },
        { path: '/patient/profile', icon: User, label: 'Profile' },
    ],
    doctor: [
        { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/doctor/prescriptions', icon: FileText, label: 'Prescriptions' },
        { path: '/doctor/patients', icon: Users, label: 'Patient Logs' },
    ],
    admin: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/inventory', icon: Package, label: 'Inventory' },
        { path: '/admin/machines', icon: Monitor, label: 'Machines' },
        { path: '/admin/users', icon: Users, label: 'Users' },
    ],
}

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const items = navItems[user?.role] || navItems.patient

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const roleColors = {
        patient: 'from-primary-500 to-primary-700',
        doctor: 'from-emerald-500 to-emerald-700',
        admin: 'from-amber-500 to-amber-700',
    }

    return (
        <div className="min-h-screen bg-dark-950 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-dark-900/80 border-r border-dark-700/50 backdrop-blur-xl">
                {/* Logo */}
                <div className="p-6 border-b border-dark-700/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center`}>
                            <Pill className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">MEDIKIOSK</h1>
                            <p className="text-xs text-dark-400 capitalize">{user?.role} Portal</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                                }
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-dark-700/50">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center text-sm font-bold text-white`}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-rose-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-dark-700 z-50 lg:hidden"
                        >
                            <div className="p-4 flex justify-between items-center border-b border-dark-700">
                                <div className="flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-primary-400" />
                                    <span className="font-bold text-white">MEDIKIOSK</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="p-4 space-y-1">
                                {items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-white hover:bg-dark-800'}
                    `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 bg-dark-900/60 border-b border-dark-700/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 lg:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 bg-dark-800/50 rounded-xl px-4 py-2 border border-dark-700/50">
                            <Search className="w-4 h-4 text-dark-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent text-sm text-white placeholder-dark-500 outline-none w-48"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl hover:bg-dark-800 text-dark-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                        <div className="lg:hidden">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center text-xs font-bold text-white`}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
