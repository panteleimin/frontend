import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ModelViewer from '../ModelViewer';

export default function ModelProfile() {
  const { id } = useParams();
  const [model, setModel] = useState(null);

  useEffect(() => {
    axios.get(`/api/models/${id}`)
      .then(res => setModel(res.data))
      .catch(err => console.error("Error loading model profile:", err));
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px'}}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '30px', background: 'linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-end))', color: 'white', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '32px' }}>{model?.title || 'Untitled'}</h1>
        </div>
        <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ height: '550px', background: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {model?.fileUrl ? (
              <ModelViewer url={`https://threedhub-backend.onrender.com${model.fileUrl}`} />
            ) : (
              <h2 style={{ color: '#ef4444' }}>3D model file is missing</h2>
            )}
          </div>
          <div style={{padding: '20px', borderRadius: '12px' }}>
            <h3>Project description:</h3>
            <p style={{ fontSize: '18px', lineHeight: '1.6'}}>
              {model?.description || 'Опис відсутній.'}
            </p>
            <hr style={{margin: '20px 0' }} />
            <p>Author: <strong>{model?.authorName || 'Anonymous user'}</strong></p>
          </div>
          {model?.fileUrl && (
            <a 
              href={`https://threedhub-backend.onrender.com${model.fileUrl}`} 
              download
              style={{
                display: 'block', textAlign: 'center', padding: '16px', borderRadius: '12px',
                background: 'linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-end))', color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold'
              }}
            >
              Download 3D file (.glb)
            </a>
          )}
        </div>
      </div>
    </div>
  );
}