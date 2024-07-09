import axios from "axios";

const API_URL = "http://localhost:8080/auth-service/";

const register = async (userData) => {
  try {
    console.log("userData:", userData);
    userData.roles = ["USER"];

    const response = await axios.post(`${API_URL}sign-up`, userData);

    console.log("Response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error from backend:", error);
    throw error;
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}sign-in`, credentials);

    console.log("Response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error from backend:", error);
    throw error;
  }
};

const logout = async (logOutRequest) => {
  try {
    const response = await axios.post(`${API_URL}log-out`, logOutRequest);

    console.log("Response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error from backend:", error);
    throw error;
  }
};

const validateToken = async (accessToken) => {
  try {
    const response = await axios.post(
      `${API_URL}validate-access-token/${accessToken}`
    );

    console.log("Response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error from backend:", error);
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  validateToken,
};

export default authService;
