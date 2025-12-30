import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  username: string;
  avatar: string;
  content: string;
  type: 'image' | 'video';
  timestamp: Date;
  duration?: number;
  viewed?: boolean;
}

const mockStories: Story[] = [
  {
    id: '1',
    username: 'john_doe',
    avatar: 'https://picsum.photos/seed/john/100/100',
    content: 'https://picsum.photos/seed/story1/400/800',
    type: 'image',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    username: 'jane_smith',
    avatar: 'https://picsum.photos/seed/jane/100/100',
    content: 'https://picsum.photos/seed/story2/400/800',
    type: 'image',
    timestamp: new Date(Date.now() - 7200000),
    viewed: true,
  },
  {
    id: '3',
    username: 'mike_wilson',
    avatar: 'https://picsum.photos/seed/mike/100/100',
    content: 'https://picsum.photos/seed/story3/400/800',
    type: 'image',
    timestamp: new Date(Date.now() - 10800000),
  },
  {
    id: '4',
    username: 'sarah_jones',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    content: 'https://picsum.photos/seed/story4/400/800',
    type: 'image',
    timestamp: new Date(Date.now() - 14400000),
    viewed: true,
  },
];

export default function StoriesScreen() {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [progress] = useState(new Animated.Value(0));
  const videoRef = useRef<Video>(null);

  const openStory = (index: number) => {
    setCurrentStoryIndex(index);
    progress.setValue(0);
    
    // Simulate story progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      nextStory();
    });

    // Mark story as viewed
    const updatedStories = [...stories];
    updatedStories[index].viewed = true;
    setStories(updatedStories);
  };

  const closeStory = () => {
    setCurrentStoryIndex(null);
    progress.setValue(0);
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
  };

  const nextStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        nextStory();
      });
    } else {
      closeStory();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        nextStory();
      });
    }
  };

  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => (
    <TouchableOpacity style={styles.storyItem} onPress={() => openStory(index)}>
      <View style={[styles.storyRing, item.viewed && styles.storyRingViewed]}>
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderStoryViewer = () => {
    if (currentStoryIndex === null) return null;

    const currentStory = stories[currentStoryIndex];

    return (
      <View style={styles.storyViewer}>
        <SafeAreaView style={styles.storyViewerHeader}>
          <View style={styles.progressContainer}>
            {stories.map((_, index) => (
              <View key={index} style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                    index === currentStoryIndex && { backgroundColor: '#fff' },
                    index < currentStoryIndex && { backgroundColor: '#fff' },
                  ]}
                />
              </View>
            ))}
          </View>

          <View style={styles.storyHeader}>
            <TouchableOpacity onPress={closeStory}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.storyUserInfo}>
              <Image source={{ uri: currentStory.avatar }} style={styles.storyUserAvatar} />
              <Text style={styles.storyUsernameText}>{currentStory.username}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.storyContent}>
          {currentStory.type === 'image' ? (
            <Image source={{ uri: currentStory.content }} style={styles.storyMedia} />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: currentStory.content }}
              style={styles.storyMedia}
              useNativeControls={false}
              shouldPlay
              resizeMode={ResizeMode.COVER}
              isLooping
            />
          )}
        </View>

        <TouchableOpacity style={styles.storyLeft} onPress={previousStory} />
        <TouchableOpacity style={styles.storyRight} onPress={nextStory} />

        <View style={styles.storyActions}>
          <TouchableOpacity style={styles.storyActionButton}>
            <Ionicons name="heart-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.storyActionButton}>
            <Ionicons name="chatbubble-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.storyActionButton}>
            <Ionicons name="paper-plane-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        <View style={styles.placeholder}>
          <Ionicons name="images" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>No recent updates</Text>
        </View>
      </View>

      {renderStoryViewer()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  storiesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#E1306C',
    padding: 2,
  },
  storyRingViewed: {
    borderColor: '#ccc',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
  },
  storyUsername: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ccc',
    marginTop: 8,
  },
  storyViewer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  storyViewerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  storyUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  storyUsernameText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  storyMedia: {
    width: width,
    height: height * 0.8,
  },
  storyLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.3,
    zIndex: 1002,
  },
  storyRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.3,
    zIndex: 1002,
  },
  storyActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    zIndex: 1001,
  },
  storyActionButton: {
    padding: 8,
  },
});
