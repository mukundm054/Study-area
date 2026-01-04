const express = require("express");
const router = express.Router();
const Post = require("../model/Post");
const User = require("../model/User");
const Post = require("../model/Post");
const Post = require("../model/Post");

router.post("/", async (req, res) => {
  try {
    const { userId, mediaUrl, mediaType, caption } = req.body;
    const user = await User.findOne({uid:userId});
    if (!user) return res.status(404).json({ error: "user not found" });

    const friendCount = user.friends.length;

    if (friendCount === 0) {
      return;
      res.status(403).json({ error: "add friends to start Posting" });
    }

    if (friendCount <= 10) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const postsToday = await Post.countDocuments({
        user: userId,
        createdAt: { $gte: today },
      });

      if (postsToday >= friendCount) {
        return;
        res
          .status(403)
          .json({ error: `Daily post limit reached ${friendCount}` });
      }
    }

    const post = await Post.create({
      user: userId,
      mediaUrl,
      mediaType,
      caption,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const Posts = await Post.find()
      .populate("user", "name photo")
      .populate("comments.user", "name photo")
      .sort({ createdAt: -1 });
    res.json(Posts);
  } catch (error) {
    res.status(500).json({ error: "Faild to Fetch Feed" });
  }
});

router.put("/like/id:", async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const index = post.likes.indexOf(userId);

  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  await post.save();
  res.json(post);
});

router.post("/comment/id:", async (req, res) => {
  const { userId, text } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.comments.push({
    user: userId,
    text,
  });

  await post.save();
  res.json(post);
});
module.exports = router;
