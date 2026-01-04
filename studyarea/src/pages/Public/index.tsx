import { selectuser } from "@/Fetaure/Userslice";
import axios from "axios";
import { console } from "inspector";
import { Heart, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const dummyPosts = [
  {
    _id: "1",
    user: {
      name: "Mukund",
      photo:
        "https://i.pinimg.com/736x/7a/a7/5c/7aa75c08b1a79ef25b3661d28a252ddd.jpg",
    },
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    caption: "Working on my internship project 🚀",
    likes: [1, 2, 3],
    comments: [{}, {}],
  },
  {
    _id: "2",
    user: {
      name: "Rahul",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    mediaType: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Learning full stack development 💻",
    likes: [1],
    comments: [{}],
  },
];

const user = useSelector(selectuser);
const [caption, setCaption] = useState("");
const [mediaUrl, setMediaUrl] = useState("");
const [mediaType, setMediaType] = useState<"image" | "video">("image");

const handelPost=async()=>{
   if(!user){
    toast.error("please login first")
    return
   }

   if(!mediaUrl){
    toast.error("media URL required")
    return
   }

   try {
    await axios.post("https://study-area-ko6n.onrender.com/api/post",{
        userId:user.uid,
        caption,
        mediaUrl,
        mediaType,
    })
    toast.success("Post created sucessfull")
    window.location.reload()
   } catch (error) {
    console.log(error)
    toast.error("Posting failed")
   }
}
const index = () => {
  return (
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-purple-500 text-center">
          Public Space
        </h1>

        {/* Create Post (STATIC) */}

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-black mb-3">
            Create a Post
          </h2>
          <textarea
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
            placeholder="whats in your mind"
            className="w-full border rounded p-2 mb-3 text-black"
          />
          <input
            type="file"
            value={mediaUrl}
            onChange={(e) => {
              setMediaUrl(e.target.value);
              setMediaType(e.target.value.includes(".mp4") ? "video" : "image");
            }}
            accept="image/*video/*"
            className="mb-3 text-blue-400 hover:text-red-500"
          />
          {mediaUrl && (
            mediaType==="image"?(
                <img src={mediaUrl} className="rounded-lg mb-3"/>
            ):(
                <video controls src={mediaUrl} className="rounded-lg mb-3"/>
            )
          )}
          <button onClick={handelPost} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
          </div>
          
        {dummyPosts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow p-4">
            {/* User */}
            <div className="flex items-center gap-3 mb-3">
              <img src={post.user.photo} className="w-10 h-10 rounded-full" />
              <span className="font-semibold text-black">{post.user.name}</span>
            </div>

            {/* Media */}
            {post.mediaType === "image" ? (
              <img src={post.mediaUrl} className="w-full rounded-lg mb-3" />
            ) : (
              <video
                src={post.mediaUrl}
                controls
                className="w-full rounded-lg mb-3"
              />
            )}

            {/* Caption */}
            <p className="text-gray-700 mb-2">{post.caption}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-1">
                <Heart size={18} />
                <span>{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={18} />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default index;
