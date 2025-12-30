const express = require('express');
const jwt = require('jsonwebtoken');
const Story = require('../models/Story');
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
    const { media, mediaType, caption, filters } = req.body;

    if (!media || !mediaType) {
      return res.status(400).json({ message: 'Media and media type are required' });
    }

    const story = new Story({
      user: req.user._id,
      media,
      mediaType,
      caption: caption || '',
      filters: filters || ['none']
    });

    await story.save();

    const user = await User.findById(req.user._id);
    user.stories.push(story._id);
    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate('user', 'username avatar');

    res.status(201).json({
      message: 'Story created successfully',
      story: populatedStory
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following');
    
    const followingIds = user.following.map(person => person._id);
    followingIds.push(req.user._id);

    const stories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'username avatar')
      .populate('viewers.user', 'username avatar')
      .sort({ createdAt: -1 });

    const groupedStories = {};
    
    stories.forEach(story => {
      const userId = story.user._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.user,
          stories: [],
          viewed: true
        };
      }
      
      const isViewed = story.viewers.some(viewer => 
        viewer.user.toString() === req.user._id.toString()
      );
      
      if (!isViewed) {
        groupedStories[userId].viewed = false;
      }
      
      groupedStories[userId].stories.push(story);
    });

    res.json(Object.values(groupedStories));
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'username avatar')
      .populate('viewers.user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:storyId/view', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const isViewed = story.viewers.some(viewer => 
      viewer.user.toString() === req.user._id.toString()
    );

    if (!isViewed) {
      story.viewers.push({ user: req.user._id });
      await story.save();
    }

    res.json({ message: 'Story viewed successfully' });
  } catch (error) {
    console.error('View story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:storyId', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await Story.findByIdAndDelete(req.params.storyId);

    const user = await User.findById(req.user._id);
    user.stories.pull(story._id);
    await user.save();

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
