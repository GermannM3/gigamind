import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const features = [
    {
      id: 'chat',
      title: 'Чат с ИИ',
      description: 'Общайтесь с интеллектуальным ассистентом',
      icon: 'chat',
      screen: 'Chat',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 'memory',
      title: 'Память',
      description: 'История ваших разговоров с ИИ',
      icon: 'psychology',
      screen: 'History',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: 'settings',
      title: 'Настройки',
      description: 'Персонализируйте ваш опыт',
      icon: 'settings',
      screen: 'Settings',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: 'about',
      title: 'О приложении',
      description: 'Узнайте больше о GigaMind',
      icon: 'info',
      screen: 'About',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  const renderFeatureCard = (feature, index) => (
    <Animated.View
      key={feature.id}
      style={[
        styles.featureCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          delay: index * 100,
        }
      ]}
    >
      <LinearGradient
        colors={feature.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => navigation.navigate(feature.screen)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon name={feature.icon} size={32} color="white" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="rgba(255, 255, 255, 0.7)" />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={['#0b1f4b', '#122e78', '#1a4bd9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[styles.header, { opacity: fadeAnim }]}
        >
          <Text style={styles.welcomeText}>Добро пожаловать в</Text>
          <Text style={styles.appTitle}>GigaMind</Text>
          <Text style={styles.subtitle}>Ваш персональный ИИ-ассистент с памятью и саморефлексией</Text>
        </Animated.View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </View>

        {/* Quick Actions */}
        <Animated.View 
          style={[styles.quickActionsSection, { opacity: fadeAnim }]}
        >
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Chat')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Icon name="question-answer" size={24} color="white" />
                <Text style={styles.quickActionText}>Новый чат</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('History')}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Icon name="history" size={24} color="white" />
                <Text style={styles.quickActionText}>История</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Icon name="settings" size={24} color="white" />
                <Text style={styles.quickActionText}>Настройки</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[styles.statsSection, { opacity: fadeAnim }]}
        >
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Icon name="chat" size={24} color="white" />
                <Text style={styles.statValue}>127</Text>
                <Text style={styles.statLabel}>Сообщений</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#ff6b6b', '#ff8e53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Icon name="psychology" size={24} color="white" />
                <Text style={styles.statValue}>4.2</Text>
                <Text style={styles.statLabel}>Средний балл</Text>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresGrid: {
    marginBottom: 30,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 16,
  },
  cardTouchable: {
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default HomeScreen;