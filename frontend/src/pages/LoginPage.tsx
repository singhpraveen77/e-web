import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Login as loginapi}from "../redux/slices/authSlice"
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../redux/store";

// type formType={
//   email:String,
//   password:String
// }

const Login: React.FC = () => {
  const navigate = useNavigate();

  const dispatch:AppDispatch= useDispatch();
  const {user , loading}=useSelector((state:RootState) => state.auth)


  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    try {
      
      if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const res=await dispatch(loginapi(formData));

    console.log("res in login.tsx",res);

    console.log("Login submitted:", formData);
  
    navigate("/");
    } catch (error) {
      console.log("error in loginpage",error);
      
    }
  };

  if(loading)return <div>loading</div>
  if(error)return <div>error</div>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
