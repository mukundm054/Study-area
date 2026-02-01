import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";


const plans = [
  { name: "FREE", label: "Free – 1 Internship / month" },
  { name: "BRONZE", label: "Bronze – ₹100 / month (3 applies)" },
  { name: "SILVER", label: "Silver – ₹300 / month (5 applies)" },
  { name: "GOLD", label: "Gold – ₹1000 / month (Unlimited)" },
];




const index = () => {
  const user = useSelector(selectuser);
  const handlePayment = async (plan: string) => {
    try {
      
      const res = await axios.post(
        "https://study-area-ko6n.onrender.com/api/subscription/create-payment",
        { plan }
      );

      const order = res.data;

      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "StudyArea",
        description: `${plan} Subscription`,
        order_id: order.id,

        handler: async function (response: any) {
          try {
            
            await axios.post(
              "https://study-area-ko6n.onrender.com/api/subscription/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                userId: user._id,
              }
            );

            toast.success("Subscription activated successfully ");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          "Payment not allowed (10–11 AM IST only)"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center text-purple-600">
          Subscription Plans
        </h1>

        {plans.map((plan) => (
          <button
            key={plan.name}
            onClick={() => handlePayment(plan.name)}
            className="w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700"
          >
            {plan.label}
          </button>
        ))}

        <p className="text-xs text-gray-600 text-center mt-3">
          Payments allowed only between <b>10:00 – 11:00 PM IST</b>
        </p>
      </div>
    </div>
  );
};

export default index;
