import { selectuser } from '@/Fetaure/Userslice';
import axios from 'axios';
import { Heart, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading,setLoading]=useState(true)
  const user = useSelector(selectuser)

  useEffect(()=>{
    const fetchPost = async()=>{
      try {
        const res = await axios.get("https://study-area-ko6n.onrender.com/api/post")
        setPosts(res.data)
      } catch (error) {
        console.log("failed to fetch post",error)
      }finally{
        setLoading(false)
      }
    }
     fetchPost()
  },[])

  if(loading){
    return <p className='text-center text-white'>Loading post</p>
  }
  return (
    <div className="min-h-screen bg-black py-10">
      <h1 className='text-2xl font-bold text-purple-600 text-center mb-6'>Public Space </h1>
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.length===0?(
          <p>No Post yet</p>
        ):(
          posts.map((post)=>(
            <div key={post._id} className="bg-white rounded-lg shadow p-4">
              {/* user */}

              <div className="flex items-center gap-3 mb-3">
                <img src={user?.photo} className="w-10 h-10 rounded-full"/>
                <span className="font-semibold text-black">{post.userEmail}</span>
              </div>

              {/* media */}
              {post.mediaType==="image"?(
                <img src={post.mediaUrl} className="w-full rounded-lg mb-3"/>
              ):(
                <video src={post.mediaUrl} controls className="w-full rounded-lg mb-3"/>
              )}

              {/* Caption */}
              <p className="text-gray-700 mb-2">{post.caption}</p>

               <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-1">
                  <Heart size={18} />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={18} />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
            
             
          ))
        )}
      </div>
    </div>
  )
}

export default index
