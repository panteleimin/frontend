import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UploadPage({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  if (!user) return <h2 style={{padding: '20px'}}>You must be logged in to download models!</h2>;

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('modelFile', file);
    formData.append('userId', user.userId); 

    try {
      await axios.post('/api/models', formData);
      alert('The model has been successfully loaded!');
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
      alert(err.response.data.error);
    } else {
      alert('Upload error!');
    }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Upload new 3D Model (.glb)</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Model name" onChange={e => setTitle(e.target.value)} required style={{ padding: '10px' }}/>
        <input type="text" placeholder="Description" onChange={e => setDescription(e.target.value)} style={{ padding: '10px' }} />
        <input type="file" accept=".glb,.gltf" onChange={e => setFile(e.target.files[0])} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px' }}>Publish</button>
      </form>
    </div>
  );
}