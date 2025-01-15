/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("login");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("userInfo"));
  //   if (user) navigate("/chats");
  // }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Bantar</h2>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-lg font-medium ${
              activeTab === "login"
                ? "border-b-4 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}>
            Login
          </button>
          <button
            className={`flex-1 py-2 text-lg font-medium ${
              activeTab === "signup"
                ? "border-b-4 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("signup")}>
            Sign Up
          </button>
        </div>

        {/* Tab Panels */}
        <div className="mt-4">
          {activeTab === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
