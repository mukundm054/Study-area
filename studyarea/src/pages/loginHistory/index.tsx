import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";
import { useEffect, useState } from "react";

const LoginHistory = () => {
  const user = useSelector(selectuser);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(
        `https://study-area-ko6n.onrender.com/api/auth/login-history/${user._id}`
      )
      .then((res) => setHistory(res.data));
  }, [user]);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-xl mb-4">Login History</h1>

      {history.map((item: any) => (
        <div key={item._id} className="bg-gray-800 p-4 mb-3 rounded">
          <p><b>Browser:</b> {item.browser}</p>
          <p><b>OS:</b> {item.os}</p>
          <p><b>Device:</b> {item.device}</p>
          <p><b>IP:</b> {item.ip}</p>
          <p><b>Status:</b> {item.status}</p>
          <p><b>Time:</b> {new Date(item.loginTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default LoginHistory;