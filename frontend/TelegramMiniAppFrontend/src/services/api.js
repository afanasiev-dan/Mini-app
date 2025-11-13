const BACKEND_URL = "https://p2p-hunters.ru";

export async function getUserOrders(userId) {
  const res = await fetch(`${BACKEND_URL}/api/Order/orders/user/${userId}/last-day`);
  if (!res.ok) throw new Error("Ошибка загрузки ордеров");
  return res.json();
}

export async function createOrder(type, data) {
  const endpoint = type === "buy" ? "/api/Order/buy_order" : "/api/Order/sell_order";
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function testApiRequest(type, body) {
  const routes = {
    healthCheck: "/live",
    getClient: (id) => `/api/Client/${id}`,
    getOrderById: (id) => `/api/Order/${id}`,
  };

  const url = routes[type] ? BACKEND_URL + routes[type](body.id) : `${BACKEND_URL}/api/Order`;
  const res = await fetch(url);
  return res.json();
}


// // Базовый URL для API (берется из переменной окружения или по умолчанию)
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// // Функция для получения заказов пользователя
// export const getUserOrders = async (userId) => {
//   try {
//     // Временная реализация с фиктивными данными
//     // В реальном приложении здесь будет реальный запрос к API
//     console.log(`Получение заказов для пользователя с ID: ${userId}`);
    
//     // Имитация API запроса
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve([
//           {
//             id: 1,
//             type: "buy",
//             amount: 10000,
//             status: "completed",
//             createdAt: new Date().toISOString()
//           },
//           {
//             id: 2,
//             type: "sell",
//             amount: 5000,
//             status: "in work",
//             createdAt: new Date(Date.now() - 3600000).toISOString() // 1 час назад
//           }
//         ]);
//       }, 300);
//     });
    
//     // Для реального API запроса раскомментируйте следующий код:
//     /*
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error(`Ошибка при получении заказов: ${response.status}`);
//     }
    
//     return await response.json();
//     */
//   } catch (error) {
//     console.error('Ошибка при получении заказов пользователя:', error);
//     throw error;
//   }
// };

// // Функция для создания заказа
// export const createOrder = async (type, orderData) => {
//   try {
//     console.log(`Создание заказа типа ${type} с данными:`, orderData);
    
//     // Имитация API запроса
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           id: Math.floor(Math.random() * 1000),
//           type,
//           ...orderData,
//           status: "created",
//           createdAt: new Date().toISOString()
//         });
//       }, 500);
//     });
    
//     // Для реального API запроса раскомментируйте следующий код:
//     /*
//     const response = await fetch(`${API_BASE_URL}/orders`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         type,
//         ...orderData
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error(`Ошибка при создании заказа: ${response.status}`);
//     }
    
//     return await response.json();
//     */
//   } catch (error) {
//     console.error('Ошибка при создании заказа:', error);
//     throw error;
//   }
// };

// // Функция для тестирования API
// export const testApiRequest = async (type, params) => {
//   try {
//     console.log(`Тестовый запрос типа ${type} с параметрами:`, params);
    
//     // Имитация различных типов тестовых запросов
//     switch (type) {
//       case 'getClient':
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve({
//               success: true,
//               data: {
//                 id: params.id,
//                 name: "Тестовый клиент",
//                 balance: 10000,
//                 ordersCount: 5
//               }
//             });
//           }, 300);
//         });
        
//       case 'getOrderById':
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve({
//               success: true,
//               data: {
//                 id: params.orderId,
//                 type: "buy",
//                 amount: 5000,
//                 status: "completed",
//                 createdAt: new Date().toISOString()
//               }
//             });
//           }, 300);
//         });
        
//       case 'healthCheck':
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve({
//               success: true,
//               message: "Сервер работает нормально",
//               timestamp: new Date().toISOString()
//             });
//           }, 200);
//         });
        
//       default:
//         return {
//           success: false,
//           error: "Неизвестный тип запроса"
//         };
//     }
    
//     // Для реального API запроса раскомментируйте следующий код:
//     /*
//     const response = await fetch(`${API_BASE_URL}/debug/${type}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(params),
//     });
    
//     if (!response.ok) {
//       throw new Error(`Ошибка при тестовом запросе: ${response.status}`);
//     }
    
//     return await response.json();
//     */
//   } catch (error) {
//     console.error('Ошибка при тестовом запросе:', error);
//     throw error;
//   }
// };