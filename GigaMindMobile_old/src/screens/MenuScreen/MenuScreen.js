import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MenuScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const menuItems = [
    {
      id: 'profile',
      title: 'Профиль',
      icon: 'person',
      screen: 'Profile',
      color: '#667eea',
    },
    {
      id: 'history',
      title: 'История разговоров',
      icon: 'history',
      screen: 'HistoryScreen',
      color: '#f093fb',
    },
    {
      id: 'favorites',
      title: 'Избранные ответы',
      icon: 'star',
      color: '#ffd166',
    },
    {
      id: 'memory',
      title: 'Управление памятью',
      icon: 'psychology',
      color: '#06d6a0',
    },
    {
      id: 'statistics',
      title: 'Статистика',
      icon: 'bar-chart',
      color: '#ef476f',
    },
    {
      id: 'settings',
      title: 'Настройки',
      icon: 'settings',
      screen: 'SettingsScreen',
      color: '#118ab2',
    },
    {
      id: 'help',
      title: 'Помощь и поддержка',
      icon: 'help',
      color: '#073b4c',
    },
    {
      id: 'about',
      title: 'О приложении',
      icon: 'info',
      screen: 'AboutScreen',
      color: '#7209b7',
    },
  ];

  const toggleSwitch = (switchType) => {
    if (switchType === 'darkMode') {
      setDarkMode(!darkMode);
    } else if (switchType === 'notifications') {
      setNotifications(!notifications);
    }
  };

  const handleMenuItemPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      // Для пунктов без экрана показываем информацию
      switch (item.id) {
        case 'help':
          Alert.alert(
            'Помощь', 
            'Если вам нужна помощь с использованием приложения, пожалуйста, ознакомьтесь с руководством пользователя или свяжитесь с нашей службой поддержки.'
          );
          break;
        case 'favorites':
          Alert.alert(
            'Избранные ответы', 
            'Функция избранных ответов пока не реализована. Она позволит сохранять наиболее полезные ответы ИИ для быстрого доступа.'
          );
          break;
        case 'memory':
          Alert.alert(
            'Управление памятью', 
            'Функция управления памятью пока не реализована. Она позволит управлять сохраненной историей разговоров и удалять ненужные данные.'
          );
          break;
        case 'statistics':
          Alert.alert(
            'Статистика', 
            'Функция статистики пока не реализована. Она покажет аналитику вашего взаимодействия с ИИ, включая количество сообщений, частоту использования и эффективность ответов.'
          );
          break;
        case 'help':
          Alert.alert(
            'Помощь и поддержка', 
            'Если вам нужна помощь с использованием приложения, пожалуйста, ознакомьтесь с руководством пользователя или свяжитесь с нашей службой поддержки.'
          );
          break;
        default:
          Alert.alert('Функция в разработке', `Функция "${item.title}" пока не реализована.`);
      }
    }
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
          <Text style={styles.title}>Меню</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userCard}
          >
            <View style={styles.userAvatar}>
              <Icon name="person" size={32} color="white" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Пользователь GigaMind</Text>
              <Text style={styles.userStatus}>Премиум аккаунт</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItemsContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={24} color="white" />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Toggles */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Настройки быстрого доступа</Text>
          
          <View style={styles.settingItem}>
            <Icon name="brightness-2" size={24} color="#667eea" />
            <Text style={styles.settingText}>Темная тема</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#667eea" }}
              thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch('darkMode')}
              value={darkMode}
            />
          </View>

          <View style={styles.settingItem}>
            <Icon name="notifications" size={24} color="#f093fb" />
            <Text style={styles.settingText}>Уведомления</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#f093fb" }}
              thumbColor={notifications ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch('notifications')}
              value={notifications}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.settingsTitle}>Быстрые действия</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ChatScreen')}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Icon name="chat" size={24} color="white" />
                <Text style={styles.quickActionText}>Новый чат</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => Alert.alert(
                'Очистка истории', 
                'Вы уверены, что хотите очистить всю историю разговоров?',
                [
                  { text: 'Отмена', style: 'cancel' },
                  { 
                    text: 'Очистить', 
                    style: 'destructive',
                    onPress: () => {
                      // Здесь должна быть логика очистки истории
                      Alert.alert('Готово', 'История сообщений очищена');
                    }
                  }
                ]
              )}
            >
              <LinearGradient
                colors={['#F44336', '#d32f2f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Icon name="delete" size={24} color="white" />
                <Text style={styles.quickActionText}>Очистить историю</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userInfoContainer: {
    marginBottom: 30,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuItemsContainer: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  settingsContainer: {
    marginBottom: 30,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginLeft: 16,
  },
  quickActionsContainer: {
    marginBottom: 20,
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
});

export default MenuScreen;