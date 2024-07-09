import React, { useContext, useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaUserEdit,
  FaLock,
  FaSignOutAlt,
  FaHome,
  FaUser,
} from "react-icons/fa";
import DashboardComponent from "../common/DashboardComponent";
import EditProfileComponent from "../common/EditProfileComponent";
import ChangePasswordComponent from "../common/ChangePasswordComponent";
import LogoutPage from "../auth/LogoutPage";
import CreateExamComponent from "./CreateExamComponent";
import { AuthContext } from "../../context/AuthContext";
import userService from "../../apis/UserService";

const AdminPanel = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const { user, userProfile, setUserProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    const validateUserToken = async () => {
      if (user && user.accessToken) {
        try {
          const response = await userService.getUserDetailsByEmailId(
            userProfile.email,
            user.accessToken
          );
          console.log("response from db by emailID:", response);
          if (response.status === 200) {
            setFoundUser(response.data);
          } else {
            setFoundUser(null);
          }
        } catch (error) {
          console.error("Error:", error);
          setFoundUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    validateUserToken();
  }, [user, userProfile]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "dashboard":
        return <DashboardComponent />;
      case "createExam":
        return <CreateExamComponent />;
      case "editProfile":
        return <EditProfileComponent />;
      case "changePassword":
        return <ChangePasswordComponent />;
      case "logOut":
        return <LogoutPage />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-full min-h-screen font-serif font-bold mx-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div
          id="header"
          className="text-3xl bg-gradient-to-r from-blue-600 to-blue-400 text-white"
        >
          <div className="flex justify-between p-3">
            <h1 className="">Online-Exam</h1>
            <ul className="flex gap-x-7">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div id="profile" className="min-h-[10.125rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 ml-32">
              <FaUserCircle className="text-8xl text-green-900 mt-8" />
              <div className="text-2xl font-serif font-semibold mt-8">
                <div className="flex items-center gap-2">
                  <FaUser className="text-xl text-green-900 mt-1" />
                  <p>{foundUser?.fullName || "No user found"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-xl text-green-900 mt-1" />
                  <p>+91 {foundUser?.phone || "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-xl text-green-900 mt-1" />
                  <p>{foundUser?.email || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="text-xl bg-gradient-to-r from-purple-600 to-purple-400 text-white p-4 rounded-lg animate-pulse">
              <p>Welcome! We're excited to have you here.</p>
            </div>
          </div>
        </div>
        {/* main */}
        <div
          id="main"
          className="max-w-screen-xl mx-auto mt-10 min-h-[30.625rem] flex shadow-lg"
        >
          <div className="flex flex-col shadow-lg w-1/4">
            <ul className="flex flex-col gap-y-9 text-2xl ml-6 mt-4">
              <li
                className="flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("dashboard")}
              >
                <FaHome className="text-2xl text-green-900" />
                <span>Dashboard</span>
              </li>
              <li
                className="flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("createExam")}
              >
                <FaClipboardList className="text-2xl text-green-900" />
                <span>Create Exam</span>
              </li>
              <li
                className="flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("editProfile")}
              >
                <FaUserEdit className="text-2xl text-green-900" />
                <span>Edit Profile</span>
              </li>
              <li
                className="flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("changePassword")}
              >
                <FaLock className="text-2xl text-green-900" />
                <span>Change Password</span>
              </li>
              <li
                className="flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("logOut")}
              >
                <FaSignOutAlt className="text-2xl text-green-900" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 min-h-96 col-span-3">
            {renderSelectedComponent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
