import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';

import HomePage from './pages/HomePage';
import AllPages from './pages/AllPages';
import ModelProfile from './pages/ModelProfile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UpdatePage from './pages/UpdatePage';
import UploadPage from './pages/UploadPage';
import UpdateUser from './pages/UpdateUser';
import AllUssers from './pages/AllUssers';
import UserPage from './pages/UserPage';
import Footer from './pages/Footer';
import JobBoard from './pages/JobBoard';
import { User, House, Sun, Moon, LogOut, LogIn, Users, Earth, Briefcase } from 'lucide-react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

function AppContent() {
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className='page-wrapper'>
      <nav className="navbar" style={{color: 'white', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', padding: '15px' }}>
        <div className="nav-group">
          <h3 className='maintext' style={{margin: '0', fontSize: '40px'}}>3D Hub</h3>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', paddingLeft: '20px' }}><House className='maintext' size={30} strokeWidth={1.5} /></Link>
          <Link to="/all" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}><Earth className='maintext' size={30}  strokeWidth={1.5} /></Link>
          <Link to="/allusers" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}><Users className='maintext' size={30} strokeWidth={1.5} /></Link>
          <Link to="/jobs" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}><Briefcase className='maintext' size={30} strokeWidth={1.5} /></Link>
          {user && <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}><User className='maintext' size={30} strokeWidth={1.5} /></Link>}
        </div>
    
        {location.pathname !== '/' && (
          <input 
            type="text" 
            className="search-input"
            placeholder="Searching..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        <div className="nav-group">
          <button onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} color="white" strokeWidth={3} /> : <Sun size={20} color="white" strokeWidth={3} />}
          </button>
          
          {user ? (
            <button onClick={handleLogout} style={{background: '#ef4444'}}><LogOut size={20} color="white" strokeWidth={3} /></button>
          ) : (
            <Link to="/login"><button><LogIn size={20} color="white" strokeWidth={3} /></button></Link>
          )}
        </div>
      </nav>


      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all" element={<AllPages search={search} user={user} setUser={setUser} />} />
          <Route path="/allusers" element={<AllUssers search={search} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/user/:id" element={<UserPage/>} />
          <Route path="/update/:id" element={<UpdatePage user={setUser} />} />
          <Route path="/upload" element={<UploadPage user={user} />} />
          <Route path="/model/:id" element={<ModelProfile />} />
          <Route path="/update-user/:id" element={<UpdateUser setUser={setUser} />} />
          <Route path="/jobs" element={<JobBoard user={user} />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}