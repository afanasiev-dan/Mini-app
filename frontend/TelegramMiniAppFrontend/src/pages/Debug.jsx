import { useState } from "react";
import { testApiRequest } from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function Debug() {
  const [output, setOutput] = useState("Здесь будут результаты...");
  const [userId, setUserId] = useState("123456789");
  const [orderId, setOrderId] = useState("1");
  const navigate = useNavigate();

  const test = async (type) => {
    try {
      const res = await testApiRequest(type, { id: userId, orderId });
      setOutput(JSON.stringify(res, null, 2));
    } catch (e) {
      setOutput("Ошибка: " + e.message);
    }
  };

  return (
    <div className="container py-5 text-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <h5 className="text-center mb-4">Отладка API</h5>

          <div className="mb-3">
            <label className="form-label">User ID</label>
            <input className="form-control" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Order ID</label>
            <input className="form-control" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-primary" onClick={() => test("getClient")}>
              Получить клиента
            </button>
            <button className="btn btn-primary" onClick={() => test("getOrderById")}>
              Заказ по ID
            </button>
            <button className="btn btn-success" onClick={() => test("healthCheck")}>
              Проверка сервера
            </button>
          </div>

          <pre className="bg-secondary p-3 mt-3 rounded" style={{ whiteSpace: "pre-wrap" }}>
            {output}
          </pre>

          <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => navigate("/")}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}
