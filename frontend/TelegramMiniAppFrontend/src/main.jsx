import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ импорт Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // (опционально, если хочешь JS-компоненты — модалки, выпадашки и т.п.)
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
