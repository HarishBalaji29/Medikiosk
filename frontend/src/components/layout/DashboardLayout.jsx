import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import {
    LayoutDashboard, Pill, Upload, History, User, Users,
    Package, Monitor, LogOut, Menu, X, Activity,
    FileText, ChevronRight, Bell, Search, Settings,
    Sun, Moon
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
    const { theme, toggleTheme, isDark } = useTheme()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
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

    // Light/Dark class sets
    const bg = isDark
        ? 'bg-dark-950'
        : 'bg-[#F4F6FB]'

    const sidebarBg = isDark
        ? 'bg-dark-900/80 border-dark-700/50'
        : 'bg-white/90 border-slate-200'

    const headerBg = isDark
        ? 'bg-dark-900/60 border-dark-700/50'
        : 'bg-white/80 border-slate-200'

    const navActive = isDark
        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
        : 'bg-blue-50 text-blue-600 border border-blue-200'

    const navInactive = isDark
        ? 'text-dark-400 hover:text-white hover:bg-dark-800/50'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'

    const textPrimary = isDark ? 'text-white' : 'text-slate-900'
    const textSecondary = isDark ? 'text-dark-400' : 'text-slate-500'
    const borderColor = isDark ? 'border-dark-700/50' : 'border-slate-200'
    const searchBg = isDark
        ? 'bg-dark-800/50 border-dark-700/50'
        : 'bg-slate-100/80 border-slate-200'
    const inputText = isDark ? 'text-white placeholder-dark-500' : 'text-slate-800 placeholder-slate-400'
    const iconBtn = isDark
        ? 'text-dark-400 hover:text-white hover:bg-dark-800'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    const dropdownBg = isDark
        ? 'bg-dark-900 border-dark-700/50 shadow-black/50'
        : 'bg-white border-slate-200 shadow-slate-200/80'
    const mobileAside = isDark
        ? 'bg-dark-900 border-dark-700'
        : 'bg-white border-slate-200'

    return (
        <div className={`min-h-screen ${bg} flex transition-colors duration-300`}>
            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col w-64 ${sidebarBg} border-r backdrop-blur-xl transition-colors duration-300`}>
                {/* Logo */}
                <div className={`p-6 border-b ${borderColor}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center`}>
                            <Pill className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-lg font-bold ${textPrimary}`}>MEDIKIOSK</h1>
                            <p className={`text-xs ${textSecondary} capitalize`}>{user?.role} Portal</p>
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
                ${isActive ? navActive : navInactive}
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className={`p-4 border-t ${borderColor}`}>
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center text-sm font-bold text-white`}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${textPrimary} truncate`}>{user?.name}</p>
                            <p className={`text-xs ${textSecondary} capitalize`}>{user?.role}</p>
                        </div>
                        <button onClick={handleLogout} className={`p-2 rounded-lg hover:bg-rose-500/10 ${textSecondary} hover:text-rose-400 transition-colors`}>
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
                            className={`fixed left-0 top-0 bottom-0 w-64 ${mobileAside} border-r z-50 lg:hidden transition-colors duration-300`}
                        >
                            <div className={`p-4 flex justify-between items-center border-b ${borderColor}`}>
                                <div className="flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-primary-400" />
                                    <span className={`font-bold ${textPrimary}`}>MEDIKIOSK</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className={`p-2 rounded-lg hover:bg-dark-800 ${textSecondary}`}>
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
                      ${isActive ? navActive : navInactive}
                    `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${borderColor}`}>
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
                <header className={`h-16 ${headerBg} border-b backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 transition-colors duration-300`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-lg ${iconBtn} transition-colors lg:hidden`}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className={`hidden md:flex items-center gap-2 ${searchBg} rounded-xl px-4 py-2 border`}>
                            <Search className={`w-4 h-4 ${textSecondary}`} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`bg-transparent text-sm ${inputText} outline-none w-48`}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">

                        {/* ── Theme Toggle ── */}
                        <motion.button
                            id="theme-toggle-btn"
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            className={`p-2 rounded-xl ${iconBtn} transition-colors relative overflow-hidden`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isDark ? (
                                    <motion.span
                                        key="sun"
                                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                        className="block"
                                    >
                                        <Sun className="w-5 h-5 text-amber-400" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="moon"
                                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                        className="block"
                                    >
                                        <Moon className="w-5 h-5 text-indigo-400" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* ── Notifications ── */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={`p-2 rounded-xl ${iconBtn} transition-colors relative`}
                            >
                                <Bell className="w-5 h-5" />
                            </button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setNotificationsOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className={`absolute right-0 top-full mt-2 w-72 ${dropdownBg} border rounded-xl shadow-xl z-50 overflow-hidden`}
                                        >
                                            <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
                                                <h3 className={`text-sm font-semibold ${textPrimary}`}>Notifications</h3>
                                            </div>
                                            <div className="p-6 text-center">
                                                <Bell className={`w-8 h-8 ${textSecondary} mx-auto mb-2 opacity-50`} />
                                                <p className={`text-sm ${textSecondary}`}>No notifications recently</p>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Settings ── */}
                        <div className="relative">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className={`p-2 rounded-xl ${iconBtn} transition-colors`}
                            >
                                <Settings className="w-5 h-5" />
                            </button>

                            <AnimatePresence>
                                {settingsOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setSettingsOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className={`absolute right-0 top-full mt-2 w-52 ${dropdownBg} border rounded-xl shadow-xl z-50 overflow-hidden`}
                                        >
                                            <div className="p-1">
                                                {/* Theme toggle inside settings dropdown too */}
                                                <button
                                                    onClick={() => { toggleTheme(); setSettingsOpen(false) }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm ${iconBtn} rounded-lg transition-colors text-left`}
                                                >
                                                    {isDark
                                                        ? <><Sun className="w-4 h-4 text-amber-400" /> Switch to Light</>
                                                        : <><Moon className="w-4 h-4 text-indigo-400" /> Switch to Dark</>
                                                    }
                                                </button>
                                                <div className={`my-1 border-t ${borderColor}`} />
                                                <button
                                                    onClick={() => {
                                                        setSettingsOpen(false)
                                                        handleLogout()
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors text-left"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Mobile Avatar ── */}
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
