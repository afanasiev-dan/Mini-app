// context/ThemeContext.js (или где бы ни был ваш файл)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd'; // Импортируем theme из antd

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  // Убедитесь, что matchMedia не вызывает ошибок на сервере
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Значение по умолчанию
};

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Инициализируем с 'light', чтобы избежать гидратации

  // Устанавливаем тему после гидратации
  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme) { // Только если тема уже установлена
      localStorage.setItem('theme', theme);
      // Опционально: можно управлять классом body, если нужно для других целей (не для AntD)
      // document.body.classList.remove('light', 'dark');
      // document.body.classList.add(theme);
    }
  }, [theme]);

  // Определяем токены и алгоритм темы AntD
  const antdTokens = theme === 'dark' ? {
    token: {
      // Пример токенов для тёмной темы
      colorPrimary: '#177ddc', // Основной цвет
      colorBgLayout: '#1f1f1f', // Цвет фона Layout
      colorText: '#ffffff', // Основной цвет текста
      colorBgContainer: '#141414', // Цвет фона контейнеров (Card, Input и т.д.)
      // ... другие токены
    },
    algorithm: antdTheme.darkAlgorithm, // ИСПОЛЬЗУЕМ АЛГОРИТМ ТЁМНОЙ ТЕМЫ
  } : {
    token: {
      // Пример токенов для светлой темы (можно оставить пустым, чтобы использовать стандартные)
      colorPrimary: '#1890ff', // Стандартный синий AntD
      colorBgLayout: '#f0f2f5', // Стандартный фон Layout
      colorText: '#000000', // Стандартный цвет текста
      // ... другие токены
    },
    algorithm: antdTheme.defaultAlgorithm, // ИСПОЛЬЗУЕМ СТАНДАРТНЫЙ АЛГОРИТМ
  };

  // Проверяем, установлена ли тема, прежде чем рендерить ConfigProvider
  if (!theme) {
    return children; // Показываем дочерние элементы без темы до определения
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Оборачиваем всё приложение в ConfigProvider с текущими токенами */}
      <ConfigProvider theme={antdTokens}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);