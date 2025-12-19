// components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Divider, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'; // Иконка "назад"

const { Title, Text, Paragraph } = Typography;

export default function Profile() {
  // Состояния для данных профиля
  const [username, setUsername] = useState('Загрузка...');
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersList, setOrdersList] = useState([]);

  // Имитация загрузки данных
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
        // Здесь вы делаете API-запрос
        setUsername('Vasya_Kripto');
        setOrdersCount(5);
        setOrdersList([
          { id: 1, type: 'BUY', amount: '100 USDT', date: '2023-10-27 10:00' },
          { id: 2, type: 'SELL', amount: '0.5 BTC', date: '2023-10-26 15:30' },
          // ... другие ордера
        ]);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        message.error('Не удалось загрузить данные профиля.');
      }
    };

    fetchProfileData();
  }, []);

  const handleNavigateBack = () => {
    // Замените на вашу логику навигации
    console.log('Navigate back clicked');
    message.info('Навигация назад (реализуйте свою логику)');
  };

  return (
    <Card
      title={
        <Title level={4} style={{ textAlign: 'center', marginBottom: 0 }}>
          Ордера за последние 24 часа
        </Title>
      }
      style={{ maxWidth: 600, width: '100%' }} // Ограничиваем ширину карточки
    >
      <Paragraph>
        <Text strong>Telegram:</Text> <Text>{username}</Text>
      </Paragraph>

      <Divider />

      <div className="mb-3">
        <Title level={5}>Ордера за последние 24 часа:</Title>
        <Text type="secondary">
          Всего: <Text strong>{ordersCount}</Text> ордеров
        </Text>

        <div id="ordersList" className="mt-3">
          {ordersList.length > 0 ? (
            ordersList.map((order) => (
              <Card.Grid key={order.id} style={{ width: '100%', padding: '12px' }}>
                <Text>{order.type}</Text> - <Text code>{order.amount}</Text> -{' '}
                <Text type="secondary">{order.date}</Text>
              </Card.Grid>
            ))
          ) : (
            <Text type="secondary" italic>Ордеров нет</Text>
          )}
        </div>
      </div>
    </Card>
  );
}