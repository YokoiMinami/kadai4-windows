import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import TopPage from './components/Top/TopPage';
import Account from './components/Account'; 
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

import AttendanceTablePage from './components/Attendance/AttendanceTable';
import NewAccountPage from './components/NewAccount/NewAccountPage';
import NewAccountAfter from './components/NewAccount/NewAccountAfter';

const AppContent = () => {
  
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<ProtectedRoute component={TopPage} />} />
        <Route path="/attendance_table" element={<AttendanceTablePage />} />
        <Route path="/new_account" element={<NewAccountPage />} />
        <Route path="/new_account_after/:id" element={<NewAccountAfter />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;