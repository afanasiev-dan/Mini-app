// components/SellForm.jsx
import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message, Space } from 'antd';
import { TagsOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function SellForm() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Данные формы продажи:', values);
    message.success('Заявка на продажу создана!');
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Ошибка валидации:', errorInfo);
    message.error('Пожалуйста, проверьте введенные данные.');
  };

  const handleNavigateBack = () => {
    console.log('Navigate back from SellForm clicked');
    message.info('Навигация назад (реализуйте свою логику)');
  };

  return (
    <Card
      title={
        <Space align="center">
          <TagsOutlined />
          <span>Создание заявки на продажу</span>
        </Space>
      }
      style={{ maxWidth: 600, width: '100%' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Валюта"
          name="currency"
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
          label="Сумма"
          name="amount"
          rules={[
            { required: true, message: 'Пожалуйста, введите сумму!' },
            { pattern: /^\d*\.?\d+$/, message: 'Введите корректное число!' },
          ]}
        >
          <Input placeholder="0,252" />
        </Form.Item>

        <Form.Item
          label="Номер телефона или карты"
          name="contact"
          rules={[
            { required: true, message: 'Пожалуйста, введите контакт!' },
            { pattern: /^\d+$/, message: 'Контакт должен содержать только цифры!' }, // Простая проверка
          ]}
        >
          <Input placeholder="89993331111" />
        </Form.Item>

        <Form.Item
          label="ФИО получателя"
          name="recipientName"
          rules={[{ required: true, message: 'Пожалуйста, введите ФИО!' }]}
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