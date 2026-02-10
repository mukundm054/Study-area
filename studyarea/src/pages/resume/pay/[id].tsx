import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ResumePayment = () => {
  const router = useRouter();
  const { id } = router.query;

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/resume-otp/send-otp",
        { resumeId: id }
      );
      toast.success("OTP sent to email");
      setOtpSent(true);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/resume-otp/verify-otp",
        { resumeId: id, otp }
      );
      toast.success("OTP verified");
      setOtpVerified(true);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const payNow = async () => {
    try {
      const res = await axios.post(
        "https://study-area-ko6n.onrender.com/api/resume-payment/create-payment",
        { resumeId: id }
      );

      const order = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "StudyArea",
        description: "Resume Generation",
        order_id: order.id,
        handler: async function (response: any) {
          await axios.post(
            "https://study-area-ko6n.onrender.com/api/resume-payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              resumeId: id,
            }
          );
          toast.success("Resume unlocked");
          router.push("/resume");
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-lg font-bold text-center">
          Resume OTP Verification
        </h2>

        {!otpSent && (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Send OTP
          </button>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border p-2 w-full"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {otpVerified && (
          <button
            onClick={payNow}
            className="bg-purple-600 text-white w-full py-2 rounded"
          >
            Pay ₹50 & Generate Resume
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumePayment;
