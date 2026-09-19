import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="grid min-h-[60vh] place-items-center bg-cream"><span className="h-9 w-9 animate-spin rounded-full border-4 border-teal/20 border-t-teal" /></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
