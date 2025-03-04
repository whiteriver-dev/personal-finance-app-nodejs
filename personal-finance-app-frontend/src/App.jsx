import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/auth/Register'; 
import Login from './components/auth/Login'; 
import Dashboard from './components/home/Dashboard';
import './App.scss'; // 

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
