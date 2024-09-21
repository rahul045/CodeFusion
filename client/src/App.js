import './App.css';
import { useState } from 'react';
import Login from './components/Login'
import Register from './components/Register';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'
import CodeSpace from './components/CodeSpace';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);
  return (
    <>
      {isLogin ? (
        <Login switchToRegister={switchToRegister} />
      ) : (
        <Register switchToLogin={switchToLogin} />
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project" element={<CodeSpace />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
