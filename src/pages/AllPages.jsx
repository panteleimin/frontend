import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ModelViewer from '../ModelViewer'; 
import { Bookmark } from 'lucide-react';

export default function AllPages({ search, user, setUser }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/models?search=${search}`)
      .then(res => setModels(res.data))
      .catch(err => console.error(err));
  }, [search]);

  const handleSaveToggle = async (modelId) => {
    if (!user) {
      alert("Please log in to save models!");
      return;
    }
    
    try {
      const res = await axios.post(`http://localhost:5000/api/users/${user.userId || user._id}/save-model`, {
        modelId: modelId
      });
      
      const updatedUser = { ...user, savedModels: res.data.savedModels };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (err) {
      console.error("Save error", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gallery of 3D Models</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {models.length === 0 ? (
          <h3>No models found</h3>
        ) : (
          models.map(m => {
            const isSaved = user?.savedModels?.includes(m._id);

            return (
              <div key={m._id} className="model-card" style={{ width: '300px' }}>
                <h3 style={{ margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.title}
                </h3>
                
                <button 
                  onClick={() => handleSaveToggle(m._id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 0 10px 0' }}
                >
                  <Bookmark 
                    size={24} 
                    color={isSaved ? "#3b82f6" : "gray"} 
                    fill={isSaved ? "#3b82f6" : "none"}  
                  />
                </button>
                
                <div style={{ height: '200px', backgroundColor: '#000', borderRadius: '8px' }}>
                  <ModelViewer url={`http://localhost:5000${m.fileUrl}`} />
                </div>
                
                <p style={{ fontSize: '14px', color: 'gray' }}>{m.description}</p>
                
                <Link to={`/model/${m._id}`}>
                  <button style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    View model
                  </button>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}