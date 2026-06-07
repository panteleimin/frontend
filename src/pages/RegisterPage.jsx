import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage({ setUser }) {

  const [file, setFile] = useState(null); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    
    if (file) {
      formData.append('iconFile', file);
    }

    try {
      const res = await axios.post('/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Registration error');
      }
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create an account</h2>
      {errorMsg && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{errorMsg}</p>}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <label style={{ textAlign: 'left', fontSize: '14px', color: 'gray', marginBottom: '-10px' }}>Avatar (optional):</label>
        <input 
          type="file" 
          accept=".jpeg,.jpg,.png" 
          onChange={e => setFile(e.target.files[0])} 
          style={{ padding: '10px' }} 
        />
        
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '10px' }} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        
        <button type="submit" style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register and log in
        </button>
      </form>
    </div>
  );
}