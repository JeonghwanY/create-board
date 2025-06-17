import './App.css'
import {Routes, Route, Link} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import Home from "./pages/Home";
import Notfound from './pages/Notfound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/Home" element={<Home />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;