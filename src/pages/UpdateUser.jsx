import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdateUser({ setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(res => setName(res.data.name || ''));
  }, [id]);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('name', name);
    if (password) formData.append('password', password);
    if (file) formData.append('iconFile', file);

    const res = await axios.put(`/api/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
 
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/profile'); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Редагувати профіль</h2>
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Your name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          style={{ padding: '10px' }} 
        />
        
        <input 
          type="password" 
          placeholder="New password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={{ padding: '10px' }} 
        />
        
        <input 
          type="file" 
          accept=".jpeg,.jpg,.png" 
          onChange={e => setFile(e.target.files[0])} 
          style={{ padding: '10px' }} 
        />
        
        <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Save changes
        </button>
      </form>
    </div>
  );
}