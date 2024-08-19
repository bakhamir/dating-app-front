import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landing';
import LoginPage from './login';
import RegisterPage from './register';
import Dashboard from './dashboard';
import Profile from './profileModal';
import Preference from './preferenceModal';
import EditProfile from './EditProfile';
import EditPreferences from './EditPreferences';
import EditUser from './EditUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preference" element={<Preference />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-preferences" element={<EditPreferences />} />
        <Route path="/edit-user" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;
