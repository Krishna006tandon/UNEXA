# UNEXA - Complete Social Media App

## 🎉 Project Status: FULLY COMPLETED

### ✅ All Features Implemented:

**Backend Infrastructure:**
- ✅ MongoDB Atlas connected (`mongodb+srv://UNEXA:UNEXA@unexa.zaxa9nd.mongodb.net/`)
- ✅ Express.js server (Port 5000)
- ✅ JWT Authentication system
- ✅ Socket.io real-time chat
- ✅ Cloudinary media upload
- ✅ Complete REST API

**Frontend Features:**
- ✅ React Native + Expo
- ✅ User Authentication (Login/Register)
- ✅ Instagram-like feed with posts & stories
- ✅ WhatsApp-like messaging interface
- ✅ Camera integration (photo/video)
- ✅ Stories viewer with progress
- ✅ User profiles & follow system
- ✅ Modern UI with React Navigation

**Advanced Features:**
- ✅ Real-time messaging
- ✅ Temporary messages (24hr expiry)
- ✅ Snapchat-like filters
- ✅ Media upload to cloud
- ✅ Push notifications ready

## 🚀 How to Run:

### Backend Server:
```bash
cd backend
npm install
npm start
# Server runs on: http://localhost:5000
```

### Frontend App:
```bash
cd UNEXA
npm install
npx expo start
# Scan QR code with Expo Go
# Or press 'a' for Android emulator
```

### Android Emulator:
```bash
# From project root
emulator -avd UNEXA_Device
```

## 📱 App Features:

### 🏠 Home Feed (Instagram-like):
- Posts with images, likes, comments
- Stories with progress bars
- Follow/unfollow users
- Save posts functionality

### 💬 Chat (WhatsApp-like):
- Real-time messaging with Socket.io
- Message read receipts
- Typing indicators
- Media sharing
- Temporary messages (24hr expiry)

### 📸 Camera & Stories:
- Photo/video capture
- Snapchat-like filters
- 24-hour story expiry
- Story viewer with swipe navigation

### 👤 User Profiles:
- Profile customization
- Followers/following system
- Post grid view
- User statistics

## 🔧 Technical Stack:

**Backend:**
- Node.js + Express.js
- MongoDB Atlas
- Socket.io
- JWT Authentication
- Cloudinary
- Multer (file uploads)

**Frontend:**
- React Native + Expo
- TypeScript
- React Navigation
- Expo Camera
- Socket.io Client
- NativeWind (Tailwind CSS)

## 🌐 API Endpoints:

### Authentication:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users:
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/follow/:userId` - Follow/unfollow

### Posts:
- `POST /api/posts/create` - Create post
- `GET /api/posts/feed` - Get feed
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comment` - Add comment

### Chat:
- `POST /api/chat/room` - Create chat room
- `GET /api/chat/rooms` - Get chat rooms
- `GET /api/chat/messages/:roomId` - Get messages
- `POST /api/chat/send` - Send message

### Stories:
- `POST /api/stories/create` - Create story
- `GET /api/stories` - Get stories
- `POST /api/stories/:storyId/view` - Mark story as viewed

### Upload:
- `POST /api/upload/upload` - Upload media
- `POST /api/upload/avatar` - Upload avatar

## 🎯 Current Status:
- ✅ Backend: Running on http://localhost:5000
- ✅ Frontend: Running on http://localhost:8082
- ✅ Android Emulator: UNEXA_Device ready
- ✅ MongoDB: Connected to Atlas cluster

**🚀 The app is fully functional and ready for use!**

All major social media features are implemented and working. You can register users, create posts, send messages, upload stories, and use all the combined features of WhatsApp, Instagram, and Snapchat in one app!
