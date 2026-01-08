import { selectuser } from "@/Fetaure/Userslice";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectuser);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const handleLike = async (postId: string) => {
    if (!user?.email) return;

    try {
      const res = await axios.put(
        `https://study-area-ko6n.onrender.com/api/post/like/${postId}`,
        { userEmail: user.email }
      );

      setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
    } catch (error) {
      console.log("Like failed", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user?.email || !commentText[postId]) return;

    try {
      const res = await axios.post(
        `https://study-area-ko6n.onrender.com/api/post/comment/${postId}`,
        {
          userEmail: user.email,
          text: commentText[postId],
        }
      );

      setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.log("Comment failed", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          "https://study-area-ko6n.onrender.com/api/post"
        );
        setPosts(res.data);
      } catch (error) {
        console.log("failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading post</p>;
  }
  return (
    <div className=" min-h-screen bg-black py-10">
      <h1 className="text-2xl font-bold text-purple-600 text-center mb-6">
        Public Space{" "}
      </h1>
      <div className="w-full sm:max-w-2xl sm:mx-auto space-y-6 px-3">
        {posts.length === 0 ? (
          <p>No Post yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4">
              {/* user */}

              <div className="flex items-center gap-3 mb-3">
                <span className="font-semibold text-black">
                  {post.userEmail}
                </span>
              </div>

              {/* media */}
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

              <div className="flex items-center gap-6 text-gray-600">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleLike(post._id)}
                >
                  <Heart
                    size={18}
                    className={
                      post.likes?.includes(user?.email)
                        ? "text-red-500 fill-red-500"
                        : ""
                    }
                  />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="mt-3">
                    {Array.isArray(post.comments) &&
                      post.comments.map(
                        (c: { userEmail: string; text: string }, i: number) => (
                          <p key={i} className="text-sm text-gray-600">
                            <strong>{c.userEmail}</strong>: {c.text}
                          </p>
                        )
                      )}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <input
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Write a comment..."
                      className="flex-1 border rounded px-2 py-1 text-black text-sm"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="bg-blue-500 text-white px-3 rounded text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default index;
