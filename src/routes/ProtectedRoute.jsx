import { Navigate } from "react-router-dom";
import { redirectPathByRole } from "../utils/authRedirect";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.userRole?.toLowerCase();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={redirectPathByRole(user)} replace />;
  }

  return children;
}

export default ProtectedRoute;