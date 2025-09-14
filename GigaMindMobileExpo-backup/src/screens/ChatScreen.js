import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../context/AppContext';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

const ChatScreen = () => {
  const {
    messages,
    isLoading,
    isConnected,
    error,
    serverStatus,
    sendMessage,
    clearMessages,
    checkConnection,
  } = useApp();

  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация появления
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  const handleClearMessages = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите удалить все сообщения?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Очистить', style: 'destructive', onPress: clearMessages },
      ]
    );
  };

  const handleRefresh = () => {
    checkConnection();
  };

  const renderMessage = ({ item, index }) => (
    <MessageBubble 
      message={item} 
      onPress={() => {
        // Можно добавить дополнительную информацию при нажатии
        if (item.judgeFeedback) {
          Alert.alert('Оценка ИИ', item.judgeFeedback);
        }
      }}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Icon name="psychology" size={24} color="white" />
            <Text style={styles.title}>GigaMind</Text>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
            ]} />
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRefresh}
            >
              <Icon name="refresh" size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleClearMessages}
            >
              <Icon name="clear-all" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.subtitle}>
          {isConnected 
            ? 'AI-ассистент с памятью и саморефлексией' 
            : 'Подключение к серверу...'
          }
        </Text>
      </LinearGradient>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="chat-bubble-outline" size={64} color="rgba(255, 255, 255, 0.5)" />
      <Text style={styles.emptyText}>
        {isConnected 
          ? 'Начните диалог с GigaMind!' 
          : 'Ожидание подключения к серверу...'
        }
      </Text>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {renderHeader()}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor="white"
              colors={['white']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#FFCDD2',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ChatScreen;
