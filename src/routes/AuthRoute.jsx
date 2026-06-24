import { Navigate } from "react-router-dom";
import { redirectPathByRole } from "../utils/authRedirect";

function AuthRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    console.log("Authenticated user found:", user);
    return <Navigate to={redirectPathByRole(user)} replace />;
  }

  return children;
}

export default AuthRoute;