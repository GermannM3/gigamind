import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gigamindAPI } from '../services/api';

// Начальное состояние
const initialState = {
  messages: [],
  isLoading: false,
  isConnected: false,
  error: null,
  userId: 'mobile_user',
  serverStatus: 'unknown',
};

// Типы действий
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_CONNECTED: 'SET_CONNECTED',
  SET_ERROR: 'SET_ERROR',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  SET_SERVER_STATUS: 'SET_SERVER_STATUS',
  SET_USER_ID: 'SET_USER_ID',
};

// Редьюсер
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ActionTypes.SET_CONNECTED:
      return { ...state, isConnected: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ActionTypes.ADD_MESSAGE:
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        error: null 
      };
    
    case ActionTypes.SET_MESSAGES:
      return { ...state, messages: action.payload };
    
    case ActionTypes.CLEAR_MESSAGES:
      return { ...state, messages: [] };
    
    case ActionTypes.SET_SERVER_STATUS:
      return { ...state, serverStatus: action.payload };
    
    case ActionTypes.SET_USER_ID:
      return { ...state, userId: action.payload };
    
    default:
      return state;
  }
};

// Создаем контекст
const AppContext = createContext();

// Провайдер контекста
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Загрузка сообщений при запуске
  useEffect(() => {
    loadMessages();
    checkConnection();
  }, []);

  // Проверка подключения к серверу
  const checkConnection = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const healthData = await gigamindAPI.healthCheck();
      dispatch({ type: ActionTypes.SET_CONNECTED, payload: true });
      dispatch({ type: ActionTypes.SET_SERVER_STATUS, payload: 'healthy' });
      dispatch({ type: ActionTypes.SET_ERROR, payload: null });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_CONNECTED, payload: false });
      dispatch({ type: ActionTypes.SET_SERVER_STATUS, payload: 'error' });
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Загрузка сообщений
  const loadMessages = async () => {
    try {
      const response = await gigamindAPI.getMessages();
      dispatch({ type: ActionTypes.SET_MESSAGES, payload: response.messages || [] });
    } catch (error) {
      console.log('Ошибка загрузки сообщений:', error.message);
    }
  };

  // Отправка сообщения
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    // Добавляем сообщение пользователя
    dispatch({ type: ActionTypes.ADD_MESSAGE, payload: userMessage });

    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.SET_ERROR, payload: null });

      const response = await gigamindAPI.sendMessage(messageText, state.userId);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message.content,
        timestamp: response.message.timestamp,
        judgeScore: response.message.judge_score,
        judgeFeedback: response.message.judge_feedback,
        contextUsed: response.context_used,
      };

      dispatch({ type: ActionTypes.ADD_MESSAGE, payload: assistantMessage });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Очистка сообщений
  const clearMessages = async () => {
    try {
      await gigamindAPI.clearMessages();
      dispatch({ type: ActionTypes.CLEAR_MESSAGES });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Установка ID пользователя
  const setUserId = (userId) => {
    dispatch({ type: ActionTypes.SET_USER_ID, payload: userId });
  };

  const value = {
    ...state,
    sendMessage,
    clearMessages,
    checkConnection,
    loadMessages,
    setUserId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Хук для использования контекста
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp должен использоваться внутри AppProvider');
  }
  return context;
};
