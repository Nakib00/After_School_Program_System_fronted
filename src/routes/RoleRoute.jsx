import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access a restricted role's page
    const dashboardMap = {
      super_admin: "/super-admin/dashboard",
      center_admin: "/center-admin/dashboard",
      teacher: "/teacher/dashboard",
      parent: "/parent/dashboard",
      student: "/student/dashboard",
    };
    return <Navigate to={dashboardMap[user.role] || "/login"} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
