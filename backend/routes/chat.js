const express = require('express');
const jwt = require('jsonwebtoken');
const { Message, ChatRoom } = require('../models/Chat');
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

router.post('/room', authMiddleware, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: 'Participant ID is required' });
    }

    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [req.user._id, participantId] },
      isGroup: false
    }).populate('participants', 'username avatar isOnline lastSeen');

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        participants: [req.user._id, participantId],
        isGroup: false
      });
      await chatRoom.save();
      
      chatRoom = await ChatRoom.findById(chatRoom._id)
        .populate('participants', 'username avatar isOnline lastSeen');
    }

    res.json(chatRoom);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({
      participants: req.user._id
    })
      .populate('participants', 'username avatar isOnline lastSeen')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(chatRooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/messages/:roomId', authMiddleware, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.roomId);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    const messages = await Message.find({ chatRoom: req.params.roomId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { roomId, content, messageType, mediaUrl, isTemporary } = req.body;

    if (!roomId || !content) {
      return res.status(400).json({ message: 'Room ID and content are required' });
    }

    const chatRoom = await ChatRoom.findById(roomId);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to send message in this chat' });
    }

    const message = new Message({
      sender: req.user._id,
      content,
      chatRoom: roomId,
      messageType: messageType || 'text',
      mediaUrl: mediaUrl || '',
      isTemporary: isTemporary || false,
      expiresAt: isTemporary ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
    });

    await message.save();

    chatRoom.lastMessage = message._id;
    await chatRoom.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/message/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const isRead = message.readBy.some(read => read.user.toString() === req.user._id.toString());

    if (!isRead) {
      message.readBy.push({ user: req.user._id });
      await message.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
