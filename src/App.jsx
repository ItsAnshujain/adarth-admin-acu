import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  </Router>
);

export default App;
