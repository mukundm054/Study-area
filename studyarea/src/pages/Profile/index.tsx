import { ExternalLink, Mail, User } from "lucide-react";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { selectuser } from "@/Fetaure/Userslice";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  name: string;
  email: string;
  photo: string;
}

const index = () => {
  const user = useSelector(selectuser);
  const [friendId, setFriendId] = useState("");

  const handelAddFriend = async () => {
    if (!friendId) {
      toast.error("Friend Id required");
      return;
    }

    try {
      await axios.put(
        `https://study-area-ko6n.onrender.com/api/user/add-friend/${user._id}`,
        { friendId: friendId }
      );
      toast.success("Friend added sucessfully");
      setFriendId("");
    } catch (error) {
      console.log(error);
      toast.error("Fialed to add friend");
    }
  };

  return (
    <div className="min-h-screen bg-black py-12">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/profile.png"
          className="w-full h-full object-cover opacity-30"
          alt="background"
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {user?.photo ? (
                <img
                  src={user?.photo}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-purple-600">
                {user?.email}
              </h1>
              <div className="mt-2 flex items-center justify-center text-white">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    0
                  </span>
                  <p className="text-blue-600 text-sm mt-1">
                    Active Application
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <span className="text-green-600 font-semibold text-2xl">
                    0
                  </span>
                  <p className="text-green-600 text-sm mt-1">
                    {" "}
                    Accepted Applications
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center pt-4">
                <Link
                  href="/userapplication"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {" "}
                  View Applications
                  <ExternalLink className="ml-2 h-4 w-4" />{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-gray-500 mb-2 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-black mb-2">Add Friend</h3>
        <input
          type="text"
          placeholder="enter friends userId"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          className=" border p-2 rounded text-black mb-3"
        />
        <button
          className="bg-blue-600 ml-3 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handelAddFriend}
        >
          Add friend
        </button>
      </div>
    </div>
  );
};

export default index;
