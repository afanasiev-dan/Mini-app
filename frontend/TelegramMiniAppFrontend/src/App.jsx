import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Selection from "./pages/Selection.jsx";
import BuyForm from "./pages/BuyForm.jsx";
import SellForm from "./pages/SellForm.jsx";
import Profile from "./pages/Profile.jsx";
import Debug from "./pages/Debug.jsx";
import ModalError from "./components/ModalError.jsx";

function App() {
  return (
    <Router>
      <ModalError />
      <Routes>
        <Route path="/" element={<Selection />} />
        <Route path="/buy" element={<BuyForm />} />
        <Route path="/sell" element={<SellForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
    </Router>
  );
}

export default App;