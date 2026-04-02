import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminMatchPanel from './pages/AdminMatchPanel';
import Navbar from './components/Navbar';

// Protect admin routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 70px)', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/match/:id" element={<PrivateRoute><AdminMatchPanel /></PrivateRoute>} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
