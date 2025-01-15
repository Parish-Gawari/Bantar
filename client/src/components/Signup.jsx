import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  // const navigate = useNavigate();

  const handleImageUpload = (file) => {
    setPicLoading(true);
    if (!file) {
      alert("Please select an image");
      setPicLoading(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");

      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url);
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPicLoading(false);
        });
    } else {
      alert("Please upload a valid image");
      setPicLoading(false);
    }
  };

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all the fields");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    setPicLoading(true);
    try {
      const { data } = await axios.post("/api/user", {
        name,
        email,
        password,
        pic,
      });

      alert("Registration Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setPicLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div className="mb-4 relative">
        <label className="block text-gray-700 font-medium">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-sm text-blue-500"
          onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="mb-4 relative">
        <label className="block text-gray-700 font-medium">
          Confirm Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Picture Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">
          Upload Your Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={submitHandler}
        disabled={picLoading}
        className={`w-full bg-blue-500 text-white font-medium py-2 rounded-lg mt-4 ${
          picLoading && "opacity-50 cursor-not-allowed"
        }`}>
        {picLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;
