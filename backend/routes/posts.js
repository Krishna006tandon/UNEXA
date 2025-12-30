const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { image, caption, tags, location } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const post = new Post({
      user: req.user._id,
      image,
      caption,
      tags: tags || [],
      location: location || ''
    });

    await post.save();

    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate('user', 'username avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following');
    
    const followingIds = user.following.map(person => person._id);
    followingIds.push(req.user._id);

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('User posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likesCount: post.likes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      text,
      timestamp: new Date()
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username avatar');

    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    const user = await User.findById(req.user._id);
    user.posts.pull(post._id);
    await user.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
