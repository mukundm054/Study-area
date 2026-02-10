import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ResumeList = () => {
  const user = useSelector(selectuser);
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(
        `https://study-area-ko6n.onrender.com/api/resume/user/${user._id}`
      )
      .then((res) => setResumes(res.data))
      .catch(() => toast.error("Failed to load resumes"));
  }, [user]);

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-xl text-white mb-4">My Resumes</h1>

      {resumes.map((r) => (
        <div
          key={r._id}
          className="bg-white p-4 rounded mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{r.personal.fullName}</p>
            <p className="text-sm text-gray-600">
              {r.isPaid ? "Unlocked" : "Locked"}
            </p>
          </div>

          {!r.isPaid && (
            <button
              onClick={() => router.push(`/resume/pay/${r._id}`)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Generate Resume ₹50
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeList;
