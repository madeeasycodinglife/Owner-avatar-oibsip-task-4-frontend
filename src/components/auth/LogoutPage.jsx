import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const handleCancel = () => {
    navigate(-1, { replace: true }); // replace : true means currect page is removed
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Logout
      </h2>
      <div className="mt-24 max-w-lg mx-auto text-center">
        <p className="  text-4xl mb-4 text-gradient-shadow">
          Do you want to logout?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg text-lg hover:from-red-600 hover:to-red-700 focus:outline-none"
          >
            Logout
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 py-3 px-4 rounded-lg text-lg hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
