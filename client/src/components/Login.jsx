/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorNotifier from "./ErrorNotifier";
import SuccessNotifier from "./SuccessNotifier";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5005/api/users/login",
        {
          email,
          password,
        }
      );

      setSuccessMessage("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data?.data));
      navigate("/chats", {
        state: { successMessage: "Login Successful" },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while logging in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      {/* Error Notification */}
      {errorMessage && (
        <ErrorNotifier
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Success Notification */}
      {successMessage && (
        <SuccessNotifier
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Login Form */}
      <form onSubmit={submitHandler}>
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-sm text-blue-500"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-medium py-2 rounded-lg mt-4 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Guest Login */}
      <button
        type="button"
        className="w-full bg-red-500 text-white font-medium py-2 rounded-lg mt-2"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}>
        Get Guest User Credentials
      </button>
    </div>
  );
};

export default Login;
