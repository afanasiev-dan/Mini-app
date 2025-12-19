// components/BuyForm.jsx
import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message, Space } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function BuyForm() {
  const [form] = Form.useForm(); // Хук для работы с формой

  const onFinish = (values) => {
    console.log('Данные формы покупки:', values);
    // Здесь вы отправляете данные на сервер
    message.success('Заявка на покупку создана!');
    form.resetFields(); // Очищаем форму после успешной отправки
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Ошибка валидации:', errorInfo);
    message.error('Пожалуйста, проверьте введенные данные.');
  };

  const handleNavigateBack = () => {
    // Замените на вашу логику навигации
    console.log('Navigate back from BuyForm clicked');
    message.info('Навигация назад (реализуйте свою логику)');
  };

  return (
    <Card
      title={
        <Space align="center">
          <ShoppingCartOutlined />
          <span>Создание заявки на покупку</span>
        </Space>
      }
      style={{ maxWidth: 600, width: '100%' }}
    >
      <Form
        form={form} // Привязываем форму к хуку
        layout="vertical" // Подписи над полями
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off" // Отключаем автозаполнение браузера
      >
        <Form.Item
          label="Валюта"
          name="currency" // Имя поля, соответствует ключу в объекте values
          rules={[{ required: true, message: 'Пожалуйста, выберите валюту!' }]}
        >
          <Select placeholder="Выберите валюту">
            <Option value="USDT">USDT</Option>
            <Option value="USDC">USDC</Option>
            <Option value="BTC">BTC</Option>
            <Option value="ETH">ETH</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Банк"
          name="bank"
          rules={[{ required: true, message: 'Пожалуйста, выберите банк!' }]}
        >
          <Select placeholder="Выберите банк">
            <Option value="Т-Банк">Т-Банк</Option>
            <Option value="Совкомбанк">Совкомбанк</Option>
            <Option value="ПСБ банк">ПСБ банк</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Bybit UID"
          name="uid"
          rules={[
            { required: true, message: 'Пожалуйста, введите UID!' },
            { pattern: /^\d+$/, message: 'UID должен содержать только цифры!' }, // Простая проверка на числа
          ]}
        >
          <Input placeholder="666666" />
        </Form.Item>

        <Form.Item
          label="Сумма"
          name="amount"
          rules={[
            { required: true, message: 'Пожалуйста, введите сумму!' },
            { pattern: /^\d*\.?\d+$/, message: 'Введите корректное число!' }, // Простая проверка числа
          ]}
        >
          <Input placeholder="0,252" />
        </Form.Item>

        <Form.Item
          label="Имя отправителя"
          name="senderName"
          rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
        >
          <Input placeholder="Вася Криптовалютов" />
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button type="primary" htmlType="submit" block>
              Создать заявку
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}