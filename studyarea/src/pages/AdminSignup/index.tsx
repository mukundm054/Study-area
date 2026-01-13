import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

const index = () => {
  const [name, setname] = useState("");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handelSignup = async () => {
    if (!value || !password) {
      toast.error("all fields required");
      return;
    }

    const isEmail = value.includes("@");

    const payload = {
      name,
      email: isEmail ? value : undefined,
      phone: !isEmail ? value : undefined,
      password,
    };

    try {
      setLoading(true);
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/admin/signup",
        payload
      );
      toast.success("signup successfull");
      router.push("/AdminLogin");
      
      
    } catch (error) {
      console.log(error);
      toast.error("Signup failed ");
    } finally {
      setLoading(false);
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

      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-white p-6 rounded w-96">
          <h2 className="text-xl font-bold mb-4 text-purple-600">Sign Up</h2>

          <div>
            <input
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter your name"
              className="border p-2 w-full mb-4 text-black"
            />

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter phone no or Email"
              className="border p-2 w-full mb-4 text-black"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="set your password"
              className="border p-2 w-full mb-4 text-black"
            />

            <button
              onClick={handelSignup}
              disabled={loading}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              {loading ? "Sign up...." : "signup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
