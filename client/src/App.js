import './App.css';
import Login from './components/Login'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'
import { BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Dashboard />
      </div>
    </BrowserRouter>
  );
}

export default App;
