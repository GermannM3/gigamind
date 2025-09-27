import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Slider,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections = [
    {
      title: 'Основные настройки',
      items: [
        {
          id: 'darkMode',
          title: 'Темная тема',
          icon: 'brightness-2',
          type: 'switch',
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
        {
          id: 'notifications',
          title: 'Уведомления',
          icon: 'notifications',
          type: 'switch',
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
        {
          id: 'sound',
          title: 'Звуковые эффекты',
          icon: 'volume-up',
          type: 'switch',
          value: soundEnabled,
          onChange: () => setSoundEnabled(!soundEnabled),
        },
      ],
    },
    {
      title: 'Отображение',
      items: [
        {
          id: 'fontSize',
          title: 'Размер шрифта',
          icon: 'format-size',
          type: 'slider',
          value: fontSize,
          min: 12,
          max: 24,
          step: 1,
          onChange: setFontSize,
        },
      ],
    },
    {
      title: 'Сохранение данных',
      items: [
        {
          id: 'autoSave',
          title: 'Автосохранение',
          icon: 'save',
          type: 'switch',
          value: autoSave,
          onChange: () => setAutoSave(!autoSave),
        },
        {
          id: 'clearHistory',
          title: 'Очистить историю',
          icon: 'delete',
          type: 'button',
          onPress: () => Alert.alert(
            'Очистить историю',
            'Вы уверены, что хотите удалить всю историю разговоров?',
            [
              { text: 'Отмена', style: 'cancel' },
              { 
                text: 'Очистить', 
                style: 'destructive',
                onPress: () => {
                  // Здесь должна быть логика очистки истории
                  Alert.alert('Готово', 'История сообщений очищена');
                }
              },
            ]
          ),
        },
      ],
    },
    {
      title: 'О приложении',
      items: [
        {
          id: 'version',
          title: 'Версия приложения',
          icon: 'info',
          type: 'info',
          value: '1.0.0',
        },
        {
          id: 'privacy',
          title: 'Политика конфиденциальности',
          icon: 'security',
          type: 'button',
          onPress: () => Alert.alert('Политика конфиденциальности', 'Все данные хранятся локально на вашем устройстве. Мы не собираем и не передаем персональные данные третьим лицам.'),
        },
        {
          id: 'terms',
          title: 'Условия использования',
          icon: 'description',
          type: 'button',
          onPress: () => Alert.alert('Условия использования', 'Используя это приложение, вы соглашаетесь с условиями использования и политикой конфиденциальности.'),
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    return (
      <View key={item.id} style={styles.settingItem}>
        <View style={styles.settingIconContainer}>
          <Icon name={item.icon} size={24} color="#667eea" />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          
          {item.type === 'switch' && (
            <Switch
              trackColor={{ false: "#767577", true: "#667eea" }}
              thumbColor={item.value ? "#ffffff" : "#f4f3f4"}
              onValueChange={item.onChange}
              value={item.value}
            />
          )}
          
          {item.type === 'slider' && (
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={item.min}
                maximumValue={item.max}
                step={item.step}
                value={item.value}
                onValueChange={item.onChange}
                minimumTrackTintColor="#667eea"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#667eea"
              />
              <Text style={styles.sliderValue}>{Math.round(item.value)}</Text>
            </View>
          )}
          
          {item.type === 'info' && (
            <Text style={styles.settingInfo}>{item.value}</Text>
          )}
          
          {item.type === 'button' && (
            <Icon name="chevron-right" size={24} color="rgba(255, 255, 255, 0.5)" />
          )}
        </View>
        
        {item.type === 'button' && (
          <TouchableOpacity 
            style={styles.settingButtonOverlay}
            onPress={item.onPress}
            activeOpacity={0.7}
          />
        )}
      </View>
    );
  };

  const renderSettingSection = (section) => (
    <View key={section.title} style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionContainer}
      >
        {section.items.map(renderSettingItem)}
      </LinearGradient>
    </View>
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
        <View style={styles.header}>
          <Text style={styles.title}>Настройки</Text>
          <Text style={styles.subtitle}>Персонализируйте ваш опыт</Text>
        </View>

        {settingsSections.map(renderSettingSection)}
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
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  sectionContainer: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  settingInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 40,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  settingButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SettingsScreen;