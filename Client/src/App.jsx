import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CCTVReportForm from './pages/ActivitiesForm';
import ActivitiesReport from './pages/ActivitiesReport';
import DailySurveillanceStatusForm from './pages/DailySurveillanceStatusForm';
import DailySurveillanceStatusReport from './pages/DailySurveillanceStatusReport';
import DashboardLayout from './layouts/DashboardLayout';
import React, { useState } from 'react';
import AddUser from './pages/AddUser';
import ChangePassword from './pages/ChangePassword';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/users';

// LoginPage component
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Removed remember state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('authToken', 'token'); // You can use a real token if implemented
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('username', data.user.username);
        window.location.href = '/cctv-report';
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">LOGIN</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full relative bg-[#2494be] text-white py-2 rounded-lg font-medium text-lg hover:bg-[#176b8a] transition-colors flex items-center justify-center">
          {/* Icon on the far left */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
              <path d="M8 24a12 12 0 1 1 3.5 3.5" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M14 16h10m0 0l-4-4m4 4l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="mx-auto">LOGIN</span>
        </button>
      </form>
    </div>
  );
}

// Real authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const getUserRole = () => {
  return localStorage.getItem('role');
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  const role = getUserRole();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <DashboardLayout role={role}>
        <Routes>
          <Route path="/cctv-report" element={<CCTVReportForm />} />
          <Route path="/activities-report" element={<ActivitiesReport />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/daily-surveillance-status" element={<DailySurveillanceStatusForm />} />
          <Route path="/daily-surveillance-status-report" element={<DailySurveillanceStatusReport />} />
                  <Route path="/add-user" element={role === 'admin' ? <AddUser /> : <Navigate to="/cctv-report" replace />} />
          <Route path="*" element={<Navigate to="/cctv-report" replace />} />
        </Routes>
      </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
