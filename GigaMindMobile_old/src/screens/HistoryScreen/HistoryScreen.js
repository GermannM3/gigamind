import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../../context/AppContext';

const HistoryScreen = () => {
  const {
    messages,
    isLoading,
    isConnected,
    error,
    serverStatus,
    loadMessages,
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
    
    // Загружаем историю при входе на экран
    refreshMessages();
  }, []);

  const refreshMessages = async () => {
    try {
      await loadMessages();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить историю сообщений');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите удалить всю историю разговоров?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await clearMessages();
              Alert.alert('Готово', 'История сообщений очищена');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить историю сообщений');
            }
          }
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessageItem = ({ item, index }) => {
    const isUser = item.role === 'user';
    const isFirstOfDay = index === 0 || 
      formatDate(messages[index - 1].timestamp) !== formatDate(item.timestamp);
    
    return (
      <View style={styles.messageContainer}>
        {isFirstOfDay && (
          <View style={styles.dateSeparator}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dateGradient}
            >
              <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
            </LinearGradient>
          </View>
        )}
        
        <Animated.View 
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            { opacity: fadeAnim }
          ]}
        >
          <LinearGradient
            colors={
              isUser 
                ? ['#667eea', '#764ba2'] 
                : ['#f093fb', '#f5576c']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.bubbleGradient,
              isUser ? styles.userGradient : styles.assistantGradient
            ]}
          >
            <View style={styles.messageHeader}>
              <View style={styles.headerLeft}>
                <Icon 
                  name={isUser ? 'person' : 'smart-toy'} 
                  size={16} 
                  color="white" 
                />
                <Text style={styles.timestamp}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
              
              {item.judgeScore && (
                <View style={styles.scoreContainer}>
                  <Icon 
                    name="star" 
                    size={14} 
                    color={
                      item.judgeScore >= 4 ? '#4CAF50' :
                      item.judgeScore >= 3 ? '#FF9800' : '#F44336'
                    } 
                  />
                  <Text style={[
                    styles.scoreText,
                    {
                      color: item.judgeScore >= 4 ? '#4CAF50' :
                             item.judgeScore >= 3 ? '#FF9800' : '#F44336'
                    }
                  ]}>
                    {item.judgeScore}/5
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.messageText} numberOfLines={3}>
              {item.content}
            </Text>
            
            {item.contextUsed && (
              <View style={styles.contextIndicator}>
                <Icon name="memory" size={12} color="#4CAF50" />
                <Text style={styles.contextText}>Контекст</Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" size={64} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyText}>История разговоров пуста</Text>
      <Text style={styles.emptySubtext}>Начните диалог с GigaMind, чтобы история появилась здесь</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0b1f4b', '#122e78', '#1a4bd9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>История разговоров</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={refreshMessages}
          >
            <Icon name="refresh" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearHistory}
          >
            <Icon name="delete" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshMessages}
            tintColor="white"
            colors={['white']}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    marginBottom: 8,
  },
  dateSeparator: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  messageBubble: {
    marginBottom: 8,
    maxWidth: '90%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  bubbleGradient: {
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userGradient: {
    borderBottomRightRadius: 5,
  },
  assistantGradient: {
    borderBottomLeftRadius: 5,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  messageText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  contextIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  contextText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default HistoryScreen;