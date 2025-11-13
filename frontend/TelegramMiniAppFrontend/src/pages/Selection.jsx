import { useNavigate } from "react-router-dom";

export default function Selection() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        <div className="card card-choice card-buy" onClick={() => navigate("/buy")}>
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            <div className="icon-wrapper mb-3">
              <i className="bi bi-currency-dollar icon-lg"></i>
            </div>
            <span>Покупка</span>
          </div>
        </div>

        <div className="card card-choice card-sell" onClick={() => navigate("/sell")}>
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            <div className="icon-wrapper mb-3">
              <i className="bi bi-cash icon-lg"></i>
            </div>
            <span>Продажа</span>
          </div>
        </div>

        <div className="card card-choice card-profile" onClick={() => navigate("/profile")}>
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            <div className="icon-wrapper mb-3">
              <i className="bi bi-person-circle icon-lg"></i>
            </div>
            <span>Личный кабинет</span>
          </div>
        </div>
      </div>
    </div>
  );
}
