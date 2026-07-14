import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiBaseUrl from "../config/api";

const Login = ({ setToken,admin,setAdmin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
          `${apiBaseUrl}/api/admins/login`,
          { email, password }
      );
      
      if (response.data.success) {
        console.log(response.data)
        setToken(response.data.token);
        console.log(response);
         const adminInfo = {
            name: response.data.name || '',
            role: response.data.role || ''
          };
        setAdmin(adminInfo || {});
        console.log(adminInfo,admin);
        toast.success('Welcome '+ adminInfo?.name );
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
  <div className="w-screen h-screen flex justify-center items-center px-8  md:px-44">
      <form
        onSubmit={onsubmitHandler}
        className="flex flex-col  rounded-lg  md:w-[700px] w-96 max-w-5xll "
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Admin Login</h2>

        {/* Email Input */}
        <div className="mb-4 relative">
          <label className="block text-gray-600 mb-1">Email:</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500">
            <FaEnvelope className="text-gray-400 text-lg mr-2" />
            <input
              type="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none text-sm"
            />
          </div>
        </div>


        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="block text-gray-600 mb-1">Password:</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500">
            <FaLock className="text-gray-400 text-lg mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none text-sm"
            />
            <button
              title=  {showPassword ? " Hide Password"  : " Show Password" }
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 my-2 rounded-lg hover:bg-blue-600 transform duration-300 "
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
