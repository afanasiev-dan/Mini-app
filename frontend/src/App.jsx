// App.jsx
import { useState, useEffect } from "react"; // Добавьте useEffect
import { Layout, Button, Space } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import { useTheme } from "./context/ThemeContext"; // Импортируем useTheme
import BuyForm from "./components/BuyForm";
import SellForm from "./components/SellForm";
import Profile from "./components/Profile";

const { Header, Content, Footer } = Layout;

function App() {
  const { theme, toggleTheme } = useTheme(); // Получаем тему из контекста
  const [currentPage, setCurrentPage] = useState('home');

  // Эффект для обновления стиля body при изменении темы (если нужно управлять фоном body напрямую)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Пример: установка базовых переменных на body, основанных на имени темы
      // Лучше настроить это в ThemeContext и использовать colorBgLayout
      if (theme === 'dark') {
        document.body.style.backgroundColor = '#1f1f1f'; // Пример цвета фона тёмной темы
        document.body.style.color = '#ffffff';             // Пример цвета текста тёмной темы
      } else {
        document.body.style.backgroundColor = '#ffffff'; // Пример цвета фона светлой темы
        document.body.style.color = '#000000';             // Пример цвета текста светлой темы
      }
    }
  }, [theme]); // Зависимость от theme

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'buy':
        return <BuyForm />;
      case 'sell':
        return <SellForm />;
      case 'profile':
        return <Profile />;
      case 'home':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Добро пожаловать!</h2>
            <p>Выберите действие внизу.</p>
          </div>
        );
      default:
        return <div>Страница не найдена</div>;
    }
  };

  return (
    <Layout className={`app-layout ${theme}`} style={{ minHeight: '100vh' }}>
      <Header className="app-header" style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px',
          backgroundColor: theme === 'dark' ? '#141414' : '#ffffff'
        }}>
        <Button onClick={toggleTheme}>
          Переключить на {theme === 'light' ? 'тёмную' : 'светлую'} тему
        </Button>
      </Header>

      <Content className="app-content" style={{
          padding: '80px 50px 100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {renderCurrentPage()}
      </Content>

      <Footer className="app-footer" style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          padding: '0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '64px'
        }}>
        <Space size="large" style={{ height: '100%', alignItems: 'center' }}>
          <Button
            type={currentPage === 'home' ? 'primary' : 'text'}
            icon={<HomeOutlined />}
            onClick={() => navigateTo('home')}
            style={{ border: 'none' }}
          >
            Домой
          </Button>
          <Button
            type={currentPage === 'buy' ? 'primary' : 'text'}
            icon={<ShoppingCartOutlined />}
            onClick={() => navigateTo('buy')}
            style={{ border: 'none' }}
          >
            Купить
          </Button>
          <Button
            type={currentPage === 'sell' ? 'primary' : 'text'}
            icon={<TagsOutlined />}
            onClick={() => navigateTo('sell')}
            style={{ border: 'none' }}
          >
            Продать
          </Button>
          <Button
            type={currentPage === 'profile' ? 'primary' : 'text'}
            icon={<UserOutlined />}
            onClick={() => navigateTo('profile')}
            style={{ border: 'none' }}
          >
            Профиль
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;