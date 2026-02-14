import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";
import { toast } from "react-toastify";

const LanguageSwitcher = () => {
  const router = useRouter();
  const user = useSelector(selectuser);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const changeLanguage = async (lang: string) => {
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    if (lang === "fr") {
      // Send OTP first
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/language/send-otp",
        { userId: user._id }
      );
      setShowOtp(true);
      return;
    }

    await axios.post(
      "https://study-area-ko6n.onrender.com/api/language/update",
      {
        userId: user._id,
        language: lang,
      }
    );

    router.push(router.pathname, router.asPath, { locale: lang });
  };

  const verifyOtp = async () => {
    try {
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/language/verify-otp",
        {
          userId: user._id,
          otp,
        }
      );

      router.push(router.pathname, router.asPath, { locale: "fr" });
      setShowOtp(false);
      toast.success("French enabled");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div>
      <select onChange={(e) => changeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="hi">Hindi</option>
        <option value="pt">Portuguese</option>
        <option value="zh">Chinese</option>
        <option value="fr">French</option>
      </select>

      {showOtp && (
        <div>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
