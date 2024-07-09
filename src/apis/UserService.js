import axios from "axios";

const API_URL = "http://localhost:8080/user-service/";

const createUser = async (user, accessToken) => {
  try {
    const response = await axios.post(`${API_URL}create`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (emailId, user, accessToken) => {
  try {
    const response = await axios.put(`${API_URL}full-update/${emailId}`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error updating user with email "${emailId}":`, error);
    throw error;
  }
};

const partiallyUpdateUser = async (emailId, user, accessToken) => {
  try {
    const response = await axios.patch(
      `${API_URL}partial-update/${emailId}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      `Error partially updating user with email "${emailId}":`,
      error
    );
    throw error;
  }
};

const deleteUser = async (emailId, accessToken) => {
  try {
    const response = await axios.delete(`${API_URL}delete/${emailId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error deleting user with email "${emailId}":`, error);
    throw error;
  }
};

const getUserDetailsByEmailId = async (emailId, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}${emailId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error fetching user details for email "${emailId}":`, error);
    throw error;
  }
};

const userService = {
  createUser,
  updateUser,
  partiallyUpdateUser,
  deleteUser,
  getUserDetailsByEmailId,
};

export default userService;
