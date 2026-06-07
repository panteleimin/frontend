import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdatePage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/models/${id}`)
      .then(res => {
        setTitle(res.data.title || '');
        setDescription(res.data.description || '');
      })
      .catch(err => console.error("Error loading model:", err));
  }, [id]);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) formData.append('modelFile', file);
    if (user?.userId) formData.append('userId', user.userId); 

    try {
      await axios.put(`http://localhost:5000/api/models/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('The model has been successfully updated!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Update error!');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Edit 3D Model</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Model name" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '10px' }} />
        <input type="text" placeholder="Brief description" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '10px' }} />
        <input type="file" accept=".glb,.gltf" onChange={e => setFile(e.target.files[0])} style={{ padding: '10px' }} />
        <p style={{fontSize: '12px', color: 'gray', margin: '-10px 0 0 0'}}>Leave the file field empty if you don't want to change the 3D model itself.</p>
        <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save changes</button>
      </form>
    </div>
  );
}