import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Admin from "./pages/admin"
import Login from "./pages/login"
import Student from "./pages/student"
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Admin />} />
          <Route path="/s" element={<Student />} />
        </Route>

        {/* Catch all - Redirect to Admin (which is protected) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
