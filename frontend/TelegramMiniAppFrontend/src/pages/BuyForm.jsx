import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyForm() {
  const [form, setForm] = useState({ currency: "", bank: "", uid: "", amount: "", name: "" });
  const navigate = useNavigate();

  const submitForm = async () => {
    if (!form.currency || !form.bank || !form.uid || !form.amount || !form.name) {
      window.showError("Пожалуйста, заполните все поля");
      return;
    }

    alert("Заявка на покупку отправлена!");
    navigate("/");
  };

  return (
    <div className="container py-5 text-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark text-light" style={{ maxWidth: 400 }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Создание заявки на покупку</h5>

          <select
            className="form-select mb-3"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="">Выберите валюту</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>

          <select
            className="form-select mb-3"
            value={form.bank}
            onChange={(e) => setForm({ ...form, bank: e.target.value })}
          >
            <option value="">Выберите банк</option>
            <option value="Т-Банк">Т-Банк</option>
            <option value="Совкомбанк">Совкомбанк</option>
            <option value="ПСБ банк">ПСБ банк</option>
          </select>

          <div className="mb-3">
            <label className="form-label">Bybit UID</label>
            <input
              type="number"
              className="form-control"
              value={form.uid}
              onChange={(e) => setForm({ ...form, uid: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Сумма</label>
            <input
              type="number"
              className="form-control"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Имя отправителя</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <button className="btn btn-primary w-100 mt-3" onClick={submitForm}>
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
