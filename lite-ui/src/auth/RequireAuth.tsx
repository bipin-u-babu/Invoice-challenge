import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const RequireAuth = ({ children, requiredRole }: RequireAuthProps) => {
  const { userId, role, loading } = useAuth();

  if (loading) {
    return <div>Loading user info...</div>;
  }

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div>Access Denied — You don't have permission to view this page.</div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
