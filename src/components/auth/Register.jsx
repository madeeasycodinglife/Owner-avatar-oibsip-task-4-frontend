import React, { useState, useContext } from "react";
import loginImage from "../../../src/assets/login.jpeg";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userService from "../../apis/UserService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null); // State for handling errors
  const { register, setUser, setUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await register({
        email,
        password,
        fullName,
        phone: phoneNumber,
      });

      setUser(response.data);

      const userResponse = await userService.getUserDetailsByEmailId(
        email,
        response.data.accessToken
      );

      const localUserProfile = {
        id: userResponse.data.id,
        fullName: userResponse.data.fullName,
        email: userResponse.data.email,
        password: userResponse.data.password,
        roles: userResponse.data.roles,
      };
      setUserProfile(localUserProfile);
      navigate("/");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
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
        } else if (status === 503) {
          navigate("/");
        } else {
          console.log("error :", error);
          setError("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received. Please try again later.");
      } else {
        console.log("other error:", error);
        // Other errors
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null); // Clear error when user starts typing in password field
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError(null); // Clear error when user starts typing in confirm password field
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="max-w-screen mx-auto bg-[#4c70dd] min-h-screen">
      <div className="text-center text-3xl sm:text-4xl sm:pt-5">
        <h1 className="font-bold text-gradient-exam lg:text-6xl text-5xl md:pt-4">
          Online Exam Portal
        </h1>
      </div>
      <div className="sm:max-w-[31.25rem] mx-auto sm:mt-3 max-w-96 bg-white shadow-lg rounded-lg overflow-hidden mt-5  sm:mt-5 h-[40.5rem] md:max-w-screen-md sm:h-[39rem] md:h-[35rem]">
        <div className="grid grid-cols-1 md:h-full  md:grid-cols-2 place-items-center ">
          <div className="">
            <img
              src={loginImage}
              alt="Login"
              className="md:w-full md:h-full object-cover md:mt-5"
            />
          </div>
          <div className="pt-2 px-8">
            <h1 className="hidden md:block mb-2">
              <FaUserCircle className="text-[#2de2c1] text-6xl mx-auto" />
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={fullName}
                onChange={handleFullNameChange}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={email}
                onChange={handleEmailChange}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                title="Phone number should be 10 digits"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              <input
                type="password"
                placeholder="Password"
                minLength="6"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                minLength="6"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {error && (
                <p className="font-bold mt-2 text-gradient-red p-2">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa] text-white p-2 rounded font-semibold text-2xl"
              >
                Register
              </button>
            </form>
            <div className="mt-4 text-center text-xl">
              <p className="text-gradient-shadow">
                Already have an account?{" "}
                <button
                  className="text-gradient-shadow-pink font-bold underline"
                  onClick={handleSignIn}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
