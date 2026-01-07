const express = require("express");
const router = express.Router();
const Post = require("../model/Post");
const User = require("../model/User");


router.post("/", async (req, res) => {
   try {
    const { userEmail, mediaUrl, mediaType, caption } = req.body;

    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const friendCount = user.friends.length;

    if (friendCount === 0) {
      return res.status(403).json({
        error: "Add friends to start posting",
      });
    }

    
    if (friendCount <= 10) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const postsToday = await Post.countDocuments({
        userEmail,
        createdAt: { $gte: today },
      });

      if (postsToday >= friendCount) {
        return res.status(403).json({
          error: `Daily limit reached (${friendCount} posts)`,
        });
      }
    }

    
    const post = await Post.create({
      userEmail,
      mediaUrl,
      mediaType,
      caption,
      likes: [],
      comments: [],
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/today-count",async (req,res) => {
  try {
      const { email } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Post.countDocuments({
      userEmail: email,
      createdAt: { $gte: today },
    });

    res.json({ count });
  } catch (error) {
      const { email } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Post.countDocuments({
      userEmail: email,
      createdAt: { $gte: today },
    });

    res.json({ count });
  }
})


router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Faild to Fetch Feed" });
  }
});

router.put("/like/:id", async (req, res) => {
  const { userEmail } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (!post.likes.includes(userEmail)) {
    post.likes.push(userEmail); // LIKE
  } else {
    post.likes = post.likes.filter(email => email !== userEmail); // UNLIKE
  }

  await post.save();
  res.json(post);
});

router.post("/comment/:id", async (req, res) => {
  const { userEmail, text } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  post.comments.push({
    userEmail,
    text,
    createdAt: new Date(),
  });

  await post.save();
  res.json(post);
});

module.exports = router;
