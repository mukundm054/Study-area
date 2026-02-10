import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Fetaure/Userslice";
import { useRouter } from "next/router";

const CreateResume = () => {
  const user = useSelector(selectuser);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");

  const handleCreate = async () => {
    if (!fullName || !summary) {
      toast.error("Required fields missing");
      return;
    }

    try {
      await axios.post(
        "https://study-area-ko6n.onrender.com/api/resume",
        {
          userId: user._id,
          personal: {
            fullName,
            email: user.email,
            summary,
          },
          skills: skills.split(","),
        }
      );

      toast.success("Resume created");
      router.push("/resume");
    } catch {
      toast.error("Resume creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-lg font-bold">Create Resume</h2>

        <input
          className="border p-2 w-full"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Professional Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Save Resume
        </button>
      </div>
    </div>
  );
};

export default CreateResume;
