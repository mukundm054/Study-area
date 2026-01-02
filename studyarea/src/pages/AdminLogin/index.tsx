import { User, Lock } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    userName: "",
    passWord: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName || !formData.passWord) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://study-area-ko6n.onrender.com/api/admin/adminlogin",
        formData
      );

      if (res.status === 200) {
        toast.success("Logged in successfully");
        router.push("/AdminPanal"); // redirect to your admin dashboard
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Invalid credentials");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/adminBackground.png"
          className="w-full h-full object-cover opacity-30"
          alt="background"
        />
      </div>

      <div className="relative min-h-screen flex flex-col justify-center sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-purple-600">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-white">
            Access the admin dashboard to manage internships and applications
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-gray-700 font-extrabold"
                >
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="userName"
                    type="text"
                    placeholder="Enter Your Username"
                    value={formData.userName}
                    onChange={handleChange}
                    className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pass"
                  className="block text-sm text-gray-700 font-extrabold"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pass"
                    name="passWord"
                    type="password"
                    placeholder="Enter Your Password"
                    value={formData.passWord}
                    onChange={handleChange}
                    className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
