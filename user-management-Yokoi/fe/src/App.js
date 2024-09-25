// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import TopPage from './components/Top/TopPage';
import Account from './components/Account'; 
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

import TopPageCopy from './components/Top/TopPageCopy';
import EquipmentPage from './components/Equipment/EquipmentPage';
import AttendancePage from './components/Attendance/AttendancePage';
import AttendanceTablePage from './components/Attendance/AttendanceTable';
import NewAccountPage from './components/NewAccount/NewAccountPage';
import NewAccountAfter from './components/NewAccount/NewAccountAfter';

//<Route path="/account" element={<ProtectedRoute component={Account} />} /> {/* ProtectedRouteを使用 */}

function App() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<ProtectedRoute component={TopPage} />} />

          <Route path="/top" element={<TopPageCopy />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance_table" element={<AttendanceTablePage month={month} />} />
          <Route path="/new_account" element={<NewAccountPage />} />
          <Route path="/new_account_after/:id" element={<NewAccountAfter />} />
        </Routes>
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;