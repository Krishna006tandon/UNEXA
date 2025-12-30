# UNEXA

A social media application built with React Native (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

- User authentication (register/login)
- Real-time chat with Socket.io
- Story sharing
- Profile management
- Image uploads with Cloudinary
- Mobile-first responsive design

## Project Structure

```
UNEXA/
├── UNEXA/                 # React Native frontend
│   ├── app/              # App screens and navigation
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── components/       # Reusable components
│   └── package.json
├── backend/              # Node.js backend API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Main server file
├── .gitignore
└── README.md
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (MongoDB Atlas for cloud)
3. **React Native development environment**
4. **Android SDK** (for mobile development)

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env

# Start the server
npm start
```

**Backend Configuration (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd UNEXA

# Install dependencies
npm install

# Start the development server
npx expo start
```

**API Configuration:**
Update the API base URL in `contexts/AuthContext.tsx`:
```typescript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

Replace `YOUR_COMPUTER_IP` with your local network IP address.

### 3. Mobile Testing

#### Option A: Real Device
1. Install **Expo Go** app on your mobile
2. Connect both computer and mobile to same WiFi network
3. Scan QR code from Expo CLI
4. Test the application

#### Option B: Android Emulator
```bash
# Start the emulator
start_avd.bat

# Run the app
npx expo start --android
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id/like` - Like/unlike post

### Chat
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/:id/messages` - Get messages

### Stories
- `GET /api/stories` - Get stories
- `POST /api/stories` - Create story

## Development

### Running Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd UNEXA
npx expo start
```

### Common Issues & Solutions

**Port 5000 already in use:**
```bash
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Network request failed:**
- Check if backend server is running
- Verify API_BASE_URL in frontend
- Ensure both devices are on same WiFi network

**Emulator not starting:**
- Enable hardware virtualization in BIOS
- Install Windows Hypervisor Platform (Windows)

## Virtual Device Setup (Without Android Studio)

This project includes scripts to set up an Android virtual device using command-line tools only, without requiring Android Studio.

### Prerequisites

1. **Android SDK Command-Line Tools**: Download from [Android Developer](https://developer.android.com/studio#command-tools)
2. **Java Development Kit (JDK)**: Version 11 or higher
3. **System Requirements**:
   - Windows 10/11, macOS, or Linux
   - At least 8GB RAM
   - 10GB free disk space

### Quick Setup

#### Windows
```bash
# Run the setup script
setup_virtual_device.bat
```

#### Linux/macOS
```bash
# Make the script executable
chmod +x setup_virtual_device.sh

# Run the setup script
./setup_virtual_device.sh
```

### Device Configuration

The virtual device is configured with:
- **Device**: Pixel 4
- **Android Version**: Android 13 (API 33)
- **Architecture**: x86_64
- **RAM**: 4GB
- **Storage**: 6GB
- **Screen**: 1080 x 2280, 440dpi

## Technologies Used

### Frontend
- React Native
- Expo
- React Navigation
- Axios
- AsyncStorage

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT
- Bcrypt
- Cloudinary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.