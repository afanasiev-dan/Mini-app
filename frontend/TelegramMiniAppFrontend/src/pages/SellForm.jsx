import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTelegram from "../hooks/useTelegram";
import { createOrder } from "../services/api.js";

export default function SellForm() {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const [form, setForm] = useState({ currency: "", bank: "", amount: "", card: "", name: "" });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    if (!form.currency || !form.bank || !form.amount || !form.card || !form.name) {
      window.showError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      await createOrder("sell", {
        userId: user?.id || 0,
        username: user?.username || "anonymous",
        currency: form.currency,
        bank: form.bank,
        amount: parseFloat(form.amount),
        paymentUserData: form.card,
        contactInfo: form.name,
      });
      alert("Заявка на продажу создана!");
      navigate("/");
    } catch (e) {
      window.showError(e.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card bg-dark text-light" style={{ maxWidth: 400 }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Создание заявки на продажу</h5>

          <select className="form-select mb-3" onChange={(e) => handleChange("currency", e.target.value)}>
            <option value="">Выберите валюту</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>

          <select className="form-select mb-3" onChange={(e) => handleChange("bank", e.target.value)}>
            <option value="">Выберите банк</option>
            <option value="Т-Банк">Т-Банк</option>
            <option value="Совкомбанк">Совкомбанк</option>
            <option value="ПСБ банк">ПСБ банк</option>
          </select>

          <input
            type="number"
            placeholder="Сумма"
            className="form-control mb-3"
            onChange={(e) => handleChange("amount", e.target.value)}
          />

          <input
            type="text"
            placeholder="Номер карты / телефона"
            className="form-control mb-3"
            onChange={(e) => handleChange("card", e.target.value)}
          />

          <input
            type="text"
            placeholder="ФИО получателя"
            className="form-control mb-3"
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
            Создать заявку
          </button>
          <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate("/")}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}
