import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../services/api.js";
import useTelegram from "../hooks/useTelegram";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      getUserOrders(user.id)
        .then(setOrders)
        .catch((err) => window.showError(err.message));
    }
  }, [user]);

  const getStatusClass = (status) => {
    switch (status) {
      case "created":
        return "status-active";
      case "in work":
        return "status-inwork";
      case "completed":
        return "status-completed";
      default:
        return "status-cancelled";
    }
  };

  return (
    <div className="container py-5 text-light">
      <div className="card bg-dark mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <h5 className="text-center mb-4">Личный кабинет</h5>
          <p>
            <strong>Telegram:</strong>{" "}
            {user ? user.username || `${user.first_name} ${user.last_name}` : "Не авторизован"}
          </p>

          <h6 className="mt-3">Ордера за последние 24 часа</h6>
          <p className="text-muted">Всего: {orders.length}</p>

          <div>
            {orders.length === 0 ? (
              <div className="text-muted">Нет активных ордеров</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className={`order-item ${getStatusClass(order.status)}`}>
                  <div>
                    <strong>{order.type === "buy" ? "Покупка" : "Продажа"}</strong> —{" "}
                    {order.amount} ₽
                  </div>
                  <div className="d-flex justify-content-between">
                    <small>{order.status}</small>
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleString("ru-RU")}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => navigate("/")}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}
