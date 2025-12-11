import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
    const { isAuthenticated, loading, hasPermission } = useAuth();

    if (loading) return <div className="flex items-center justify-center min-h-screen text-navy-900">Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (requiredPermission && !hasPermission(requiredPermission)) {
        // Option: Redirect to a "Not Authorized" page or just home
        return <div className="p-10 text-center text-red-500 font-bold">You are not authorized to view this page.</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
