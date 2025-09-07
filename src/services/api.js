import axios from 'axios';

// Базовый URL сервера GigaMind
const BASE_URL = 'http://germannm3-gigamind-f816.twc1.net:8000';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API методы для работы с GigaMind
export const gigamindAPI = {
  // Проверка состояния сервера
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Сервер недоступен: ${error.message}`);
    }
  },

  // Тестовый endpoint
  async testConnection() {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка подключения: ${error.message}`);
    }
  },

  // Отправка сообщения в чат
  async sendMessage(message, userId = 'mobile_user') {
    try {
      const response = await api.post('/chat', {
        user_id: userId,
        message: message,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка отправки сообщения: ${error.message}`);
    }
  },

  // Получение истории сообщений
  async getMessages(limit = 50) {
    try {
      const response = await api.get(`/messages?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения истории: ${error.message}`);
    }
  },

  // Очистка истории сообщений
  async clearMessages() {
    try {
      const response = await api.delete('/messages');
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка очистки истории: ${error.message}`);
    }
  },
};

export default api;
