import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthTemplate from './components/auth/AuthTemplate';
import Dashboard from './components/home/Dashboard';
import './App.scss'; // 
import MobileNavbar from './components/navigation/MobileNavbar';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/register" element={<AuthTemplate />} />
        <Route path="/login" element={<AuthTemplate/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/componenttest" element={<MobileNavbar />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
