import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AboutScreen = () => {
  const features = [
    {
      title: '🧠 GigaMemory',
      description: 'Долговременная память пользователя для сохранения контекста разговоров',
      icon: 'psychology',
      color: '#667eea',
    },
    {
      title: '💬 Human-centered Assistant',
      description: 'Персонализированный помощник с эмпатией и адаптацией под пользователя',
      icon: 'person',
      color: '#f093fb',
    },
    {
      title: '⚖️ Agent-as-Judge',
      description: 'Самооценка и рефлексия ИИ для повышения качества ответов',
      icon: 'balance',
      color: '#4CAF50',
    },
  ];

  const links = [
    {
      title: '🌐 Документация проекта',
      url: 'https://github.com/GermannM3/gigamind',
      icon: 'description',
    },
    {
      title: '🐛 Сообщить об ошибке',
      url: 'https://github.com/GermannM3/gigamind/issues',
      icon: 'bug-report',
    },
    {
      title: '⭐ Оценить проект',
      url: 'https://github.com/GermannM3/gigamind/stargazers',
      icon: 'star',
    },
  ];

  const handleLinkPress = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть ссылку');
        }
      })
      .catch((err) => {
        Alert.alert('Ошибка', `Не удалось открыть ссылку: ${err}`);
      });
  };

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
        <View style={styles.header}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Icon name="psychology" size={48} color="white" />
          </LinearGradient>
          
          <Text style={styles.appName}>GigaMind</Text>
          <Text style={styles.version}>Версия 1.0.0</Text>
          <Text style={styles.tagline}>Ваш AI-ассистент с памятью и саморефлексией</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>
          <Text style={styles.description}>
            GigaMind - это инновационный AI-ассистент, который объединяет три ключевые функции в единую систему:
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <LinearGradient
              key={index}
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureHeader}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Icon name={feature.icon} size={24} color="white" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Technical Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Технические детали</Text>
          <View style={styles.techDetails}>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Фреймворк:</Text>
              <Text style={styles.techValue}>React Native</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Версия React Native:</Text>
              <Text style={styles.techValue}>0.74.0</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Язык программирования:</Text>
              <Text style={styles.techValue}>JavaScript/JSX</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>API:</Text>
              <Text style={styles.techValue}>REST API через HTTPS</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Цветовая схема:</Text>
              <Text style={styles.techValue}>#0b1f4b → #122e78 → #1a4bd9</Text>
            </View>
          </View>
        </View>

        {/* Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Полезные ссылки</Text>
          {links.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkCard}
              onPress={() => handleLinkPress(link.url)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.linkGradient}
              >
                <View style={styles.linkContent}>
                  <Icon name={link.icon} size={24} color="white" />
                  <Text style={styles.linkText}>{link.title}</Text>
                  <Icon name="open-in-new" size={20} color="rgba(255, 255, 255, 0.5)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsTitle}>Разработано с ❤️</Text>
          <Text style={styles.creditsText}>
            GigaMind использует мощные технологии для создания уникального опыта взаимодействия с ИИ.
          </Text>
          <Text style={styles.creditsText}>
            Особая благодарность сообществу React Native и Sber за предоставление GigaChat API.
          </Text>
        </View>
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  techDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  techRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  techLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    width: 180,
  },
  techValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  linksSection: {
    marginBottom: 30,
  },
  linkCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  linkGradient: {
    borderRadius: 16,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginLeft: 16,
  },
  creditsSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  creditsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  creditsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default AboutScreen;