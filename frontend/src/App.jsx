import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Public Pages
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard'
import Upload from './pages/patient/Upload'
import Processing from './pages/patient/Processing'
import Summary from './pages/patient/Summary'
import Dispensing from './pages/patient/Dispensing'
import Success from './pages/patient/Success'
import PatientHistory from './pages/patient/History'
import PatientProfile from './pages/patient/Profile'

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorPrescriptions from './pages/doctor/Prescriptions'
import DoctorPatientLogs from './pages/doctor/PatientLogs'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import Inventory from './pages/admin/Inventory'
import Machines from './pages/admin/Machines'
import Users from './pages/admin/Users'

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    {/* Patient Routes */}
                    <Route
                        path="/patient"
                        element={
                            <ProtectedRoute allowedRoles={['patient']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="upload" element={<Upload />} />
                        <Route path="processing" element={<Processing />} />
                        <Route path="summary" element={<Summary />} />
                        <Route path="dispensing" element={<Dispensing />} />
                        <Route path="success" element={<Success />} />
                        <Route path="history" element={<PatientHistory />} />
                        <Route path="profile" element={<PatientProfile />} />
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>

                    {/* Doctor Routes */}
                    <Route
                        path="/doctor"
                        element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<DoctorDashboard />} />
                        <Route path="prescriptions" element={<DoctorPrescriptions />} />
                        <Route path="patients" element={<DoctorPatientLogs />} />
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="machines" element={<Machines />} />
                        <Route path="users" element={<Users />} />
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                </BrowserRouter>
            </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    )
}
