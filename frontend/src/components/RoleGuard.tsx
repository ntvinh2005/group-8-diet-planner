import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RoleGuard() {
  const { user } = useAuth();

  if (user?.accountType !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
