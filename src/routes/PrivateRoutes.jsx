import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../apis/AuthService";

const PrivateRoute = () => {
  const { user, setUser, setUserProfile } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const validateUserToken = async () => {
      if (user && user.accessToken) {
        try {
          const response = await authService.validateToken(user.accessToken);
          console.log("Token validation response:", response);

          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token validation error:", error);

          if (error.response) {
            const { status } = error.response;

            if (status === 401) {
              // Handle other error status codes
            }
            // Handle other error status codes
            else if (status === 403) {
              // Handle Forbidden error
            } else if (status === 404) {
              // Handle Not Found error
            } else if (status === 405) {
              // Handle Method Not Allowed error
            } else if (status === 500) {
              // Handle Internal Server Error
            } else if (status === 503) {
              // Handle Service Unavailable
            }
            setUser(null);
            localStorage.removeItem("user");
            setUserProfile(null);
            localStorage.removeItem("userProfile");
          }
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    validateUserToken();
  }, [user, setUser]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
