// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// УДАЛИТЕ ЭТУ СТРОКУ
// import 'bootstrap/dist/css/bootstrap.min.css'

// УДАЛИТЕ ЭТУ СТРОКУ, ЕСЛИ ВЫ ДОБАВЛЯЛИ ПЕРЕОПРЕДЕЛЕНИЯ
// import './bootstrap-theme-overrides.css'

import './index.css' // Импортируем основные стили (где переменные и body)
import { ThemeProvider } from './context/ThemeContext'; // Убедитесь, что путь верный`

// Если вы будете использовать глобальные стили AntD, импортируйте их ЗДЕСЬ
// import 'antd/dist/reset.css'; // Старая версия (до v5.13.0)
import 'antd/dist/reset.css'; // Для версии 5.13.0 и выше (рекомендуется)
// Для более старых версий v5.x.x используйте:
// import 'antd/dist/reset.css'; // Это заменило antd/dist/antd.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)