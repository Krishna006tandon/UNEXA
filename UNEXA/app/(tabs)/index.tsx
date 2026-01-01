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
  LinearGradient,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
  id: string;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
  comments: number;
  timestamp: Date;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface Story {
  id: string;
  username: string;
  avatar: string;
  content: string;
  viewed?: boolean;
}

const mockStories: Story[] = [
  {
    id: '1',
    username: 'Your Story',
    avatar: 'https://picsum.photos/seed/mystory/100/100',
    content: 'https://picsum.photos/seed/mystory/400/800',
  },
  {
    id: '2',
    username: 'john_doe',
    avatar: 'https://picsum.photos/seed/john/100/100',
    content: 'https://picsum.photos/seed/story1/400/800',
    viewed: true,
  },
  {
    id: '3',
    username: 'jane_smith',
    avatar: 'https://picsum.photos/seed/jane/100/100',
    content: 'https://picsum.photos/seed/story2/400/800',
  },
  {
    id: '4',
    username: 'mike_wilson',
    avatar: 'https://picsum.photos/seed/mike/100/100',
    content: 'https://picsum.photos/seed/story3/400/800',
    viewed: true,
  },
];

const mockPosts: Post[] = [
  {
    id: '1',
    username: 'john_doe',
    avatar: 'https://picsum.photos/seed/john/100/100',
    image: 'https://picsum.photos/seed/feed1/400/400',
    likes: 128,
    caption: 'Beautiful sunset at the beach! 🌅 #nature #photography',
    comments: 24,
    timestamp: new Date(Date.now() - 3600000),
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    username: 'jane_smith',
    avatar: 'https://picsum.photos/seed/jane/100/100',
    image: 'https://picsum.photos/seed/feed2/400/400',
    likes: 256,
    caption: 'Coffee and coding ☕💻 Perfect combination!',
    comments: 42,
    timestamp: new Date(Date.now() - 7200000),
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    username: 'mike_wilson',
    avatar: 'https://picsum.photos/seed/mike/100/100',
    image: 'https://picsum.photos/seed/feed3/400/400',
    likes: 89,
    caption: 'Adventure awaits! 🏔️ #hiking #outdoors',
    comments: 15,
    timestamp: new Date(Date.now() - 10800000),
    isLiked: false,
    isSaved: true,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories] = useState<Story[]>(mockStories);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
  };

  const toggleSave = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));
  };

  const renderStory = ({ item, index }: { item: Story; index: number }) => (
    <TouchableOpacity style={styles.storyItem}>
      <View style={[styles.storyRing, index === 0 ? styles.myStoryRing : item.viewed ? styles.storyRingViewed : null]}>
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
        {index === 0 && (
          <View style={styles.addStoryButton}>
            <Ionicons name="add" size={12} color="white" />
          </View>
        )}
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
          <Text style={styles.postUsername}>{item.username}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.actionButton}>
            <LinearGradient
              colors={item.isLiked ? ['#FF6B6B', '#FF8E53'] : ['#666', '#999']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color="white"
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="chatbubble-outline" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="paper-plane-outline" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => toggleSave(item.id)} style={styles.actionButton}>
          <LinearGradient
            colors={item.isSaved ? ['#FFD93D', '#FF6B6B'] : ['#999', '#666']}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.postStats}>
        <Text style={styles.likesText}>{item.likes} likes</Text>
      </View>

      <View style={styles.postCaption}>
        <Text style={styles.captionUsername}>{item.username}</Text>
        <Text style={styles.captionText}>{item.caption}</Text>
      </View>

      <TouchableOpacity style={styles.commentsButton}>
        <Text style={styles.commentsText}>View all {item.comments} comments</Text>
      </TouchableOpacity>

      <Text style={styles.timestampText}>{item.timestamp.toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>UNEXA</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="add-circle-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.storiesContainer}>
          <FlatList
            data={stories}
            renderItem={renderStory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          />
        </View>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.postsList}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 20,
  },
  headerButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  storiesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  storiesList: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    padding: 2,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  myStoryRing: {
    borderColor: '#FF6B6B',
    borderWidth: 3,
  },
  storyRingViewed: {
    borderColor: '#dbdbdb',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'white',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  storyUsername: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
  },
  postsList: {
    backgroundColor: 'white',
  },
  postContainer: {
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postUsername: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  postActionsLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  iconGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  postStats: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  likesText: {
    fontWeight: '600',
    fontSize: 14,
  },
  postCaption: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  captionUsername: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  captionText: {
    fontSize: 14,
    flex: 1,
  },
  commentsButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  commentsText: {
    color: '#737373',
    fontSize: 14,
  },
  timestampText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: '#737373',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
