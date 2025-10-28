import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Use RTK Query hook to fetch current profile
  const { data: profileData, isLoading, error } = useProfileQuery();

  useEffect(() => {
    if (!profileData) return;

    // Map API response to the provider shape expected by consumers
    const mapped = {
      firstName:
        profileData.name ||
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
