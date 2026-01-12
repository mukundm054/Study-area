import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!value) {
      toast.error("Email or phone required");
      return;
    }

    const isEmail = value.includes("@");

    const payload = {
      email: isEmail ? value : undefined,
      phone: !isEmail ? value : undefined,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        "https://study-area-ko6n.onrender.com/api/auth/forgot-password",
        payload
      );
      toast.success(`New Password: ${res.data.newPassword}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <input
          className="border p-2 w-full mb-4"
          placeholder="Email or Phone"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-red-600 text-white w-full py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        <Link href="/forgotpass" className="text-gray-700 hover:text-blue-600">
          Forgot password
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
