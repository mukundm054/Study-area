import axios from "axios";
import { Phone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const index = () => {
  const [value, setvalue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  const handelLogin = async () => {
    if (!value || !password) {
      toast.error("all fields required");
      return;
    }

    const isEmail = value.includes("@");

    const payload = {
      email: isEmail ? value : undefined,
      phone: !isEmail ? value : undefined,
      password,
    };

    try {
      setLoading(true);
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/admin/login",
        payload
      );
      toast.success("Login successfull");
      router.push("/AdminPanal")
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
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
          <h2 className="text-xl text-purple-600 font-bold mb-4">Login</h2>

          <input
            className="border p-2 w-full mb-2 text-black"
            placeholder="Email or Phone"
            value={value}
            onChange={(e) => setvalue(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 w-full mb-4 text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handelLogin}
            disabled={loading}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link
            href="/forgotpass"
            className="text-gray-700 hover:text-blue-600 mt-2"
          >
            Forgot password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default index;
