import React, { createContext, useEffect, useState } from "react";
import authService from "../apis/AuthService";
import userService from "../apis/UserService";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Retrieve and parse user and userProfile from localStorage, or set them to null if not found
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const storedUserProfile = localStorage.getItem("userProfile");
    return storedUserProfile ? JSON.parse(storedUserProfile) : null;
  });
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  }, [user, userProfile]);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.status === 200) {
        setUser(response.data);
        const accessToken = response.data.accessToken;
        try {
          const userResponse = await userService.getUserDetailsByEmailId(
            email,
            accessToken
          );
          if (userResponse.status === 200) {
            const localUserProfile = {
              id: userResponse.data.id,
              fullName: userResponse.data.fullName,
              email: userResponse.data.email,
              password: userResponse.data.password,
              roles: userResponse.data.roles,
            };
            setUserProfile(localUserProfile);
          } else {
            console.log("error while fetching userDetails by emailId:", email);
          }
        } catch (error) {
          console.log("error while fetching userDetails by emailId:", error);
        }
      } else {
        console.error("Unexpected response:", response);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        try {
          const userResponse = await userService.getUserDetailsByEmailId(
            userData.email,
            accessToken
          );
          if (userResponse.status === 200) {
            setUser(response.data);
            const localUserProfile = {
              id: userResponse.data.id,
              fullName: userResponse.data.fullName,
              email: userResponse.data.email,
              password: userResponse.data.password,
              roles: userResponse.data.roles,
            };
            setUserProfile(localUserProfile);
          } else {
            console.log(
              "error while fetching userDetails by emailId:",
              userData.email
            );
          }
        } catch (error) {
          console.log("error while fetching userDetails by emailId:", error);
        }
      } else {
        console.error("Unexpected response:", response);
      }
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const logOutRequest = {
      email: userProfile.email,
      accessToken: userData.accessToken,
    };
    await authService.logout(logOutRequest);
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        setUser,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
