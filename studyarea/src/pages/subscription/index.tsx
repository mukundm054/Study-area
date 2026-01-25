import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'


const plans = [
    {name:"FREE",price:0,label:"Free - 1 Intership/month"},
    {name:"BRONZE",price:100,label:"Bronze – ₹100 / month (3 applies)"},
    {name:"FREE",price:0,label:" Silver – ₹300 / month (5 applies)"},
    {name:"FREE",price:0,label:"Gold – ₹1000 / month (Unlimited)"},
]
const index = () => {
    const handelPayment=async(plan:string)=>{
        try {
            const res = await axios.post("https://study-area-ko6n.onrender.com/api/subscription/create-payment",{plan})

            const order = res.data

            const options ={
                key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount:order.amount,
                currency:"INR",
                name:"Study Area",
                description:`${plan} Subscription`,
                order_id:order.id,
                handel:function(responce:any){
                    toast.success("payment is successfull")
                    console.log("Payment responce:",responce)
                },
                theme:{
                 color:"#6366f1",
                },
            }

            const rozorpay=new (window as any).Rozorpay(options)
            rozorpay.open()
        } catch (error:any) {
            toast.error(
                error?.response?.data?.error || "Payment not allowed now"
            )
        }
    }
  return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='bg-white p-6 rounded-2xl w-100'>
        <h1 className='text-xl font-bold mb-4 text-center text-purple-600'>Subscription Plan</h1>
        {plans.map((plan)=>(
            <button key={plan.name} onClick={()=>handelPayment(plan.name)} className='w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-800'>
              {plan.label}
            </button>
        ))}
        <p className='text-xs text-gray-600 text-center mt-2'>
            Payment allowed only between <b>10-11 AM IST</b>
        </p>
      </div>
    </div>
  )
}

export default index
