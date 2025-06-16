import './App.css'
import {Routes, Route, Link} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Notfound from './pages/Notfound';

function App() {
  return (
    <Routes>
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;