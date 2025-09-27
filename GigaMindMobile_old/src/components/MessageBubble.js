import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MessageBubble = ({ message, onPress }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getScoreColor = (score) => {
    if (score >= 4) return '#4CAF50';
    if (score >= 3) return '#FF9800';
    return '#F44336';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isUser && styles.userContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          isUser 
            ? ['#667eea', '#764ba2'] 
            : ['#f093fb', '#f5576c']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bubble, isUser && styles.userBubble]}
      >
        <View style={styles.messageHeader}>
          <Icon 
            name={isUser ? 'person' : 'smart-toy'} 
            size={16} 
            color="white" 
          />
          <Text style={styles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>
        </View>

        <Text style={styles.messageText}>
          {message.content}
        </Text>

        {isAssistant && message.judgeScore && (
          <View style={styles.judgeInfo}>
            <View style={styles.scoreContainer}>
              <Icon name="star" size={14} color={getScoreColor(message.judgeScore)} />
              <Text style={[styles.scoreText, { color: getScoreColor(message.judgeScore) }]}>
                {message.judgeScore}/5
              </Text>
            </View>
            {message.contextUsed && (
              <View style={styles.contextIndicator}>
                <Icon name="memory" size={12} color="#4CAF50" />
                <Text style={styles.contextText}>Контекст</Text>
              </View>
            )}
          </View>
        )}

        {isAssistant && message.judgeFeedback && (
          <Text style={styles.feedbackText}>
            {message.judgeFeedback}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userBubble: {
    borderBottomRightRadius: 5,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  judgeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  contextIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  contextText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '500',
  },
  feedbackText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default MessageBubble;
