import { selectuser } from "@/Fetaure/Userslice";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const index = () => {
  const user = useSelector(selectuser);

  const [Caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [loading, setLoading] = useState(false);

  const handelPost = async () => {
    if (!user) {
      toast.error("please login first");
      return;
    }

    if (!mediaUrl) {
      toast.error("Media is required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("https://study-area-ko6n.onrender.com/api/post", {
        userEmail: user.email,
        Caption,
        mediaUrl,
        mediaType,
      });
      toast.success("Post created sucessfull");
      setCaption("");
      setMediaUrl("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-xl mx-auto bg-gray-300 rounded-lg shadow p-6">
        <h1 className="text-lg font-bold text-purple-500 mb-4">Create Post</h1>
        <textarea
          value={Caption}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
          placeholder="What's on your mind?"
          className="w-full border rounded p-2 mb-3 text-black"
        />
        <input value={mediaUrl}  onChange={(e) => {
            setMediaUrl(e.target.value);
            setMediaType(e.target.value.includes(".mp4") ? "video" : "image");
          }}
          className="w-full border rounded p-2 mb-3 text-black"
          />

        {mediaUrl && (
            mediaType==="image"?(
                <img src={mediaUrl} className="rounded mb-3" />
            ):(
                <video src={mediaUrl} className="rounded mb-3"/>
            )
        )}

        <button onClick={handelPost} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-400"  >
            {loading?"Posting...":"Post"}
        </button>
      </div>
    </div>
  );
};

export default index;
