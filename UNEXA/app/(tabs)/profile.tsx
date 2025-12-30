import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
  id: string;
  image: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

const mockPosts: Post[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/post1/300/300',
    likes: 42,
    comments: 8,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/post2/300/300',
    likes: 128,
    comments: 24,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/post3/300/300',
    likes: 89,
    comments: 15,
    timestamp: new Date(Date.now() - 10800000),
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/post4/300/300',
    likes: 256,
    comments: 42,
    timestamp: new Date(Date.now() - 14400000),
  },
  {
    id: '5',
    image: 'https://picsum.photos/seed/post5/300/300',
    likes: 67,
    comments: 12,
    timestamp: new Date(Date.now() - 18000000),
  },
  {
    id: '6',
    image: 'https://picsum.photos/seed/post6/300/300',
    likes: 193,
    comments: 31,
    timestamp: new Date(Date.now() - 21600000),
  },
];

export default function ProfileScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeTab, setActiveTab] = useState<'grid' | 'mentions'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);

  const userStats = {
    posts: posts.length,
    followers: 1234,
    following: 567,
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Unfollowed' : 'Following',
      isFollowing ? 'You have unfollowed this user' : 'You are now following this user'
    );
  };

  const editProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStat}>
          <Ionicons name="heart" size={16} color="white" />
          <Text style={styles.postStatText}>{item.likes}</Text>
        </View>
        <View style={styles.postStat}>
          <Ionicons name="chatbubble" size={16} color="white" />
          <Text style={styles.postStatText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={editProfile}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarSection}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/profile/150/150' }}
              style={styles.profileAvatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.username}>@unexa_user</Text>
          <Text style={styles.bio}>
            Welcome to UNEXA! 🚀 Your all-in-one social media app with WhatsApp, Instagram, and Snapchat features.
          </Text>
          <TouchableOpacity style={styles.websiteButton}>
            <Ionicons name="link" size={16} color="#007AFF" />
            <Text style={styles.websiteText}>unexa.app</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={toggleFollow}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Ionicons name="paper-plane" size={18} color="#007AFF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="person-add" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons
              name="grid"
              size={24}
              color={activeTab === 'grid' ? '#333' : '#999'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mentions' && styles.activeTab]}
            onPress={() => setActiveTab('mentions')}
          >
            <Ionicons
              name="person"
              size={24}
              color={activeTab === 'mentions' ? '#333' : '#999'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.postsContainer}>
          {activeTab === 'grid' ? (
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.postsGrid}
            />
          ) : (
            <View style={styles.mentionsContainer}>
              <Ionicons name="person-outline" size={48} color="#ccc" />
              <Text style={styles.mentionsText}>No mentions yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarSection: {
    marginRight: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  bioSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteText: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#333',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  messageButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  moreButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  postsContainer: {
    flex: 1,
  },
  postsGrid: {
    paddingHorizontal: 1,
  },
  postItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mentionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  mentionsText: {
    color: '#ccc',
    marginTop: 12,
  },
});
