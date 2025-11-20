import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update token state when localStorage changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
    };

    // Check immediately
    checkToken();

    // Listen for storage events (for cross-tab changes)
    window.addEventListener("storage", checkToken);

    // Custom event for same-tab token changes
    window.addEventListener("tokenChange", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("tokenChange", checkToken);
    };
  }, []);

  // Use RTK Query hook to fetch current profile
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useProfileQuery(undefined, {
    skip: !token, // Skip the query if no token
  });

  // Refetch profile when token changes
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    if (!profileData) {
      // Clear user state if no profile data
      setUser(null);
      return;
    }

    // Map API response to the provider shape expected by consumers
    const mapped = {
      firstName:
        profileData.firstName ||
        (profileData.email ? profileData.email.split("@")[0] : ""),
      lastName: "",
      email: profileData.email || "",
      mobileNumber: profileData.phone || profileData.mobile || "",
      location: profileData.address || "",
      image: profileData.profile || profileData.profileImage || "",
      raw: profileData,
    };

    setUser(mapped);
  }, [profileData]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
