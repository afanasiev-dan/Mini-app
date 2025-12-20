// App.jsx
import { useState, useEffect } from "react"; // Добавьте useEffect
import { Layout, Button, Space, Flex } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UserOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useTheme } from "./context/ThemeContext"; // Импортируем useTheme
import BuyForm from "./components/BuyForm";
import SellForm from "./components/SellForm";
import Profile from "./components/Profile";
import { Typography } from "antd";
import img from "./assets/cards_real.png"; // Убедитесь, что путь к изображению верный

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const { theme, toggleTheme } = useTheme(); // Получаем тему из контекста
  const [currentPage, setCurrentPage] = useState("home");

  // Эффект для обновления стиля body при изменении темы (если нужно управлять фоном body напрямую)
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Пример: установка базовых переменных на body, основанных на имени темы
      // Лучше настроить это в ThemeContext и использовать colorBgLayout
      if (theme === "dark") {
        document.body.style.backgroundColor = "#1f1f1f"; // Пример цвета фона тёмной темы
        document.body.style.color = "#ffffff"; // Пример цвета текста тёмной темы
      } else {
        document.body.style.backgroundColor = "#ffffff"; // Пример цвета фона светлой темы
        document.body.style.color = "#000000"; // Пример цвета текста светлой темы
      }
    }
  }, [theme]); // Зависимость от theme

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "buy":
        return <BuyForm />;
      case "sell":
        return <SellForm />;
      case "profile":
        return <Profile />;
      case "home":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "400px",
                height: "400px",
                marginBottom: "200px",
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <h2 style={{fontSize: 48, textAlign: "center", marginTop: 300}}>Добро пожаловать!</h2>
            <p style={{fontSize: 24, marginTop: -18}}>Выберите действие внизу</p>
          </div>
        );
      default:
        return <div>Страница не найдена</div>;
    }
  };

  return (
    <Layout className={`app-layout ${theme}`} style={{ minHeight: "100vh"}}>
      <Header
        className="app-header"
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 24px",
          backgroundColor: theme === "dark" ? "#0a0a0a" : "#f1f2f6",
          borderWidth: "0 0 1px 0",
          borderStyle: "solid",
          borderColor: theme === "dark" ? "#303030" : "#fff",
        }}
      >
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Hunters
            </Title>{" "}
            {/* Убираем margin */}
          </div>

          <div>
            <Button
              type="text" // Тип 'text' часто подходит для иконок
              icon={<SunOutlined />} // Иконка переключения
              onClick={toggleTheme}
              aria-label={`Переключить на ${
                theme === "light" ? "тёмную" : "светлую"
              } тему`}
              // Опционально: можно добавить tooltip
            >
              {/* Текст можно убрать, если нужна только иконка */}
              {/* {theme === 'light' ? 'Тёмная' : 'Светлая'} */}
            </Button>
          </div>
        </Flex>
      </Header>

      <Content
        className="app-content"
        style={{
          padding: "80px 50px 100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderCurrentPage()}
      </Content>

      <Footer
        className="app-footer"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          padding: "0",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "64px",
        }}
      >
        <Space size="large" style={{ height: "100%", alignItems: "center" }}>
          <Button
            type={currentPage === "home" ? "primary" : "text"}
            icon={<HomeOutlined />}
            onClick={() => navigateTo("home")}
            style={{ border: "none" }}
          >
            Домой
          </Button>
          <Button
            type={currentPage === "buy" ? "primary" : "text"}
            icon={<ShoppingCartOutlined />}
            onClick={() => navigateTo("buy")}
            style={{ border: "none" }}
          >
            Купить
          </Button>
          <Button
            type={currentPage === "sell" ? "primary" : "text"}
            icon={<TagsOutlined />}
            onClick={() => navigateTo("sell")}
            style={{ border: "none" }}
          >
            Продать
          </Button>
          <Button
            type={currentPage === "profile" ? "primary" : "text"}
            icon={<UserOutlined />}
            onClick={() => navigateTo("profile")}
            style={{ border: "none" }}
          >
            Профиль
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;
