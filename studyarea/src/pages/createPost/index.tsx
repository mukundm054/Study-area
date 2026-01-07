import { selectuser } from "@/Fetaure/Userslice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const index = () => {
  const user = useSelector(selectuser);

  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [loading, setLoading] = useState(false);

  const [friendCount,setFriendCount]=useState(0)
  const [postsToday,setPostsToday]=useState(0)
  const [canPost,setCanPost]=useState(true)

  useEffect(()=>{
    if(!user?.email) return

    const fetchLimit = async()=>{
      try {
        const friendRes=await axios.post("https://study-area-ko6n.onrender.com/api/user/friends-count",{email:user.email})
        const count = friendRes.data.count
        setFriendCount(count)

        const postRes=await axios.post("https://study-area-ko6n.onrender.com/api/post/today-count",{email:user.email})
        const todayCount=postRes.data.count
        setPostsToday(todayCount)

        if(count===0){
          setCanPost(false)
        }else if(count>10){
          setCanPost(true)
        }else{
          setCanPost(todayCount<count)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLimit()
  },[user])

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
        caption,
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
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
          placeholder="What's on your mind?"
          className="w-full border rounded p-2 mb-3 text-black"
        />
        <input  value={mediaUrl}  onChange={(e) => {
            setMediaUrl(e.target.value);
            setMediaType(e.target.value.includes(".mp4") ? "video" : "image");
          }}
          className="w-full border rounded p-2 mb-3 text-black"
          />

        {mediaUrl && (
            mediaType==="image"?(
                <img src={mediaUrl} className="rounded mb-3" />
            ):(
                <video src={mediaUrl} controls className="rounded mb-3"/>
            )
        )}

        <button onClick={handelPost} disabled={loading || !canPost} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-400"  >
            {loading ? "Posting..." : canPost ? "Post" : "Daily limit reached"}
        </button>
      </div>
    </div>
  );
};

export default index;
