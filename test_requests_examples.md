# Примеры запросов для тестирования API

## Клиенты

### Создание/обновление клиента
```json
POST /api/Client
Content-Type: application/json

{
  "telegramId": 123456789,
  "username": "testuser",
  "fullName": "Иван Петров"
}
```

### Получение информации о клиенте
```
GET /api/Client/123456789
```

### Проверка существования клиента
```
GET /api/Client/exists/123456789
```

### Получение списка клиентов
```
GET /api/Client?username=test&page=1&pageSize=10
```

### Обновление информации о клиенте
```json
PUT /api/Client/123456789
Content-Type: application/json

{
  "telegramId": 123456789,
  "username": "testuser",
  "fullName": "Иван Петров-новый"
}
```

### Удаление клиента
```
DELETE /api/Client/123456789
```

## Заказы

### Создание заказа на покупку
```json
POST /api/Order/buy_order
Content-Type: application/json

{
  "userId": 123456789,
  "userName": "testuser",
  "currency": "USDT",
  "bank": "Т-Банк",
  "amount": 100.5,
  "contactInfo": "Иван Петров, 89991234567"
}
```

### Создание заказа на продажу
```json
POST /api/Order/sell_order
Content-Type: application/json

{
  "userId": 123456789,
  "userName": "testuser",
  "currency": "USDT",
  "bank": "Т-Банк",
  "amount": 50.25,
  "paymentUserData": "4276123456789012",
  "contactInfo": "Иван Петров"
}
```

### Получение всех заказов
```
GET /api/Order
```

### Получение заказа по ID
```
GET /api/Order/1
```

### Обновление статуса заказа
```json
PUT /api/Order/order/1/status
Content-Type: application/json

{
  "status": "in work"
}
```

## Статусы заказов

Допустимые статусы:
- `created` - Создан
- `in work` - В работе  
- `completed` - Завершён

## Валюты

Поддерживаемые валюты:
- USDT
- USDC
- BTC
- ETH

## Банки

Примеры банков:
- Т-Банк
- Совкомбанк
- ПСБ банк