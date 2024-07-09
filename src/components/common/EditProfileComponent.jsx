import React, { useState, useEffect, useContext } from "react";
import userService from "../../apis/UserService";
import { AuthContext } from "../../context/AuthContext";

const EditProfileComponent = () => {
  const { user, setUser, userProfile, setUserProfile } =
    useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.accessToken) {
        try {
          const userResponse = await userService.getUserDetailsByEmailId(
            userProfile.email,
            user.accessToken
          );
          if (userResponse.status === 200) {
            const userData = userResponse.data;
            setFullName(userData.fullName);
            setEmail(userData.email);
            setPhoneNumber(userData.phone);
          } else {
            setError("Failed to fetch user data. Please try again later.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (error.response) {
            const status = error.response.status;
            if (status === 400) {
              setError("Bad request. Please check your inputs.");
            } else if (status === 401) {
              setError("Unauthorized. Please check your credentials.");
            } else if (status === 403) {
              setError("Forbidden. Access denied.");
            } else if (status === 404) {
              setError("Resource not found.");
            } else if (status === 405) {
              setError("Method not allowed. Please try again later.");
            } else if (status === 409) {
              setError("Conflict. User already exists.");
            } else if (status === 500) {
              setError("Internal server error. Please try again later.");
            } else {
              setError("An error occurred. Please try again later.");
            }
          } else if (error.request) {
            setError("No response received. Please try again later.");
          } else {
            setError("An error occurred. Please try again later.");
          }
        }
      }
    };

    fetchUserData();
  }, [user, userProfile]);

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        fullName,
        email,
        phone: phoneNumber,
      };
      console.log(user.accessToken, userProfile.email);
      const userResponse = await userService.partiallyUpdateUser(
        userProfile.email,
        updatedUser,
        user.accessToken
      );
      if (userResponse.status === 200) {
        const localUserProfile = {
          id: userResponse.data.id,
          fullName: userResponse.data.fullName,
          email: userResponse.data.email,
          password: userResponse.data.password,
          roles: userResponse.data.roles,
        };
        const localUser = {
          accessToken: userResponse.data.accessToken,
          refreshToken: userResponse.data.refreshToken,
        };
        setUserProfile(localUserProfile);
        setUser(localUser);
        setError(null); // Clear error state upon successful update
      } else {
        setError("Failed to update user profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Bad request. Please check your inputs.");
        } else if (status === 401) {
          setError("Unauthorized. Please check your credentials.");
        } else if (status === 403) {
          setError("Forbidden. Access denied.");
        } else if (status === 404) {
          setError("Resource not found.");
        } else if (status === 405) {
          setError("Method not allowed. Please try again later.");
        } else if (status === 409) {
          setError("Conflict. User already exists.");
        } else if (status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        setError("No response received. Please try again later.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleCancel = () => {
    // Reset form fields and error state upon cancel
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setError(null);
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="fullName" className="mr-4 w-20 text-right">
            Name :
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={handleFullNameChange}
            placeholder="Full Name"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="email" className="mr-4 w-20 text-right">
            Email :
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="phoneNumber" className="mr-4 w-20 text-right">
            Phone :
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Phone"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && (
          <p className="text-center error-text font-bold text-xl mt-2 px-2 ms-[5rem]">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2 hover:bg-[#5050c7] focus:outline-none"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#6e9d27] focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileComponent;
