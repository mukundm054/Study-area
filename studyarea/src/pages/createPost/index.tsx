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

  const [friendCount, setFriendCount] = useState(0);
  const [postsToday, setPostsToday] = useState(0);
  const [canPost, setCanPost] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchLimit = async () => {
      try {
        const friendRes = await axios.post(
          "https://study-area-ko6n.onrender.com/api/user/friends-count",
          { email: user.email }
        );
        const count = friendRes.data.count;
        setFriendCount(count);

        const postRes = await axios.post(
          "https://study-area-ko6n.onrender.com/api/post/today-count",
          { email: user.email }
        );
        const todayCount = postRes.data.count;
        setPostsToday(todayCount);

        if (count === 0) {
          setCanPost(false);
        } else if (count > 10) {
          setCanPost(true);
        } else {
          setCanPost(todayCount < count);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLimit();
  }, [user]);

  let postLeft = 0;

  if (friendCount === 0) {
    postLeft = 0;
  } else if (friendCount === 10) {
    postLeft = -1;
  } else {
    postLeft = Math.max(friendCount - postsToday, 0);
  }

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
      setPostsToday((prev) => prev + 1);
      setCaption("");
      setMediaUrl("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create post or your daily limit reached");
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
        <input
          value={mediaUrl}
          onChange={(e) => {
            setMediaUrl(e.target.value);
            setMediaType(e.target.value.includes(".mp4") ? "video" : "image");
          }}
          className="w-full border rounded p-2 mb-3 text-black"
        />

        {mediaUrl &&
          (mediaType === "image" ? (
            <img src={mediaUrl} className="rounded mb-3" />
          ) : (
            <video src={mediaUrl} controls className="rounded mb-3" />
          ))}

        <div className="mb-3 text-sm font-semibold text-gray-700">
          {friendCount === 0 && (
            <span className="text-red-600">
              ❌ Add at least 1 friend to start posting
            </span>
          )}

          {friendCount > 0 && friendCount <= 10 && (
            <span className="text-blue-700">
              📌 Posts left today: {postLeft}
            </span>
          )}

          {friendCount > 10 && (
            <span className="text-green-700">🚀 Unlimited posts today</span>
          )}
        </div>

        <button
          onClick={handelPost}
          disabled={loading || !canPost}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          {loading ? "Posting..." : canPost ? "Post" : "Daily limit reached"}
        </button>
      </div>
      <div className="mt-6 max-w-xl mx-auto bg-white border-l-4 border-purple-500 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-purple-600 mb-2">
          Posting has limits
        </h2>
        <ul className="space-y-1 text-gray-700 text-sm">
          <li>
            🚫 <strong>0 friends:</strong> You cannot post
          </li>
          <li>
            🟢 <strong>1 friend:</strong> 1 post per day
          </li>
          <li>
            🟡 <strong>2 friends:</strong> 2 posts per day
          </li>
          <li>
            🔥 <strong>More than 10 friends:</strong> Unlimited posts
          </li>
        </ul>
      </div>
    </div>
  );
};

export default index;
