import axios from "axios";
import { Phone } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const login = () => {
  const [value, setvalue] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)

  const handelLogin = async () => {
    if (!value || !password) {
      toast.error("all fields required");
      return;
    }

    const isEmail = value.includes("@");

    const payload = {
      email: isEmail ? value : undefined,
      Phone: !isEmail ? value : undefined,
      password,
    };

    try {
      setLoading(true)
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/auth/login",
        payload
      );
      toast.success("Login successfull");
    } catch (error) {
      console.log(error)
      toast.error("Login failed")
    }finally{
      setLoading(false)
    }
  };
  return (
     <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email or Phone"
          value={value}
          onChange={(e) => setvalue(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
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
      </div>
    </div>
  );
};

export default login;
