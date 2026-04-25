import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

export default function ProtectedRoute() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { role, fetchProfile, isLoading } = useUserStore();
    const location = useLocation();

    useEffect(() => {
        if (isSignedIn && !role) {
            getToken().then(token => {
                if (token) fetchProfile(token);
            });
        }
    }, [isSignedIn, role, fetchProfile, getToken]);

    if (!isLoaded || (isSignedIn && !role && isLoading)) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-[#1a2230]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    // RBAC Redirect Logic
    if (role === 'super_user') {
        if (!location.pathname.startsWith('/su')) {
            return <Navigate to="/su" replace />;
        }
    } else if (role === 'admin') {
        // Admins can access / and /s. If they try to go to /su, redirect to /.
        // Current routes for admin are / and /s (inside DashboardLayout)
        if (location.pathname.startsWith('/su')) {
            return <Navigate to="/" replace />;
        }
        // If they try to access student routes /c or /p? 
        // usage says "user -> /c, can access /p". Admin -> /
        if (location.pathname.startsWith('/c') || location.pathname.startsWith('/p')) {
            return <Navigate to="/" replace />;
        }
    } else if (role === 'user' || role === 'student') {
        // User/Student can access /c and /p.
        // Redirect if they try to access /su, /, /s
        if (location.pathname.startsWith('/su') || location.pathname === '/' || location.pathname === '/s') {
            return <Navigate to="/c" replace />;
        }
    }

    return <Outlet />;
}
