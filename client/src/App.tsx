import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Admin from "./pages/admin"
import Login from "./pages/login"
import Student from "./pages/student"
import StudentHome from "./pages/studenthome"
import Payment from "./pages/payment"
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'

import SuperAdmin from "./pages/superadmin"
import Pay from "./pages/Pay"

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Super Admin - No Sidebar */}
          <Route path="/su" element={<SuperAdmin />} />

          {/* Standard Admin/Student Dashboard - With Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Admin />} />
            <Route path="/s" element={<Student />} />
            {/* Student Portal Routes */}
            <Route path="/c" element={<StudentHome />} />
            <Route path="/p" element={<Payment />} />
          </Route>

        </Route>

        {/* Payment Page - Public & Dynamic */}
        <Route path="/pay/:studentId" element={<Pay />} />

        {/* Catch all - Redirect to Admin (which is protected) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
