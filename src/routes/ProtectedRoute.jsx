import { Navigate, useLocation } from "react-router-dom";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

// Safely decode JWT payload to extract role without external deps
const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    console.log(token);

    const parts = token.split(".");
    if (parts.length < 2) return null;

    // base64url -> base64
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const jsonPayload = decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload?.role ?? null;
  } catch (err) {
    return null;
  }
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  // call hook unconditionally to satisfy rules of hooks
  const { data: profile, isLoading, isError, isFetching } = useProfileQuery();

  const roleFromToken = getRoleFromToken();

  console.log("Role from token", roleFromToken);

  // If role is present in token and authorized, allow immediately
  const allowedRoles = [
    "ADMIN",
    "MODERATOR",
    "JUROR",
    "SITEFUND",
    "DOCUMENTS",
    "SUPER_ADMIN",
    "USER",
  ];

  if (roleFromToken && allowedRoles.includes(roleFromToken)) {
    return children;
  }

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (profile?.role && allowedRoles.includes(profile.role)) {
    return children;
  }

  return <Navigate to="/auth/login" state={{ from: location }} />;
};

export default PrivateRoute;
