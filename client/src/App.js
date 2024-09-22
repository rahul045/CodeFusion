import './App.css';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import MyNavbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CodeSpace from './components/CodeSpace';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import About from './components/About';

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      {isAuthenticated && <MyNavbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            isLogin ? (
              <Login switchToRegister={switchToRegister} onLogin={handleLogin} />
            ) : (
              <Navigate to="/register" />
            )
          }
        />

        <Route
          path="/register"
          element={
            !isLogin ? (
              <Register switchToLogin={switchToLogin} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <About />
            </PrivateRoute>
          }
        />
        <Route
          path="/project"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CodeSpace />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
