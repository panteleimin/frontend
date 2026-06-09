import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ModelViewer from '../ModelViewer';
import { User } from 'lucide-react';

export default function UserPage() {
  const { id } = useParams();
  const [viewUser, setViewUser] = useState(null);
  const [userModels, setUserModels] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`/api/user/${id}`)
      .then(res => setViewUser(res.data))
      .catch(err => {
        console.error("User not found:", err);
        setError(true);
      });

    axios.get(`/api/models?userId=${id}`)
      .then(res => setUserModels(res.data))
      .catch(err => console.error("Error loading models:", err));
  }, [id]);

  if (error) return <h2 style={{padding: '20px', textAlign: 'center', color: 'red'}}>User not found!</h2>;
  if (!viewUser) return <h2 style={{padding: '20px', textAlign: 'center'}}>Loading profile...</h2>;

  return (
    <div style={{ padding: '20px' }}>
 
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', padding: '20px'}}>
        {viewUser.icon ? (
          <img 
            src={viewUser.icon} 
            alt="Avatar" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #3b82f6' }} 
          />
        ) : (
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#999999', fontSize: '40px' }}>
            <User size='100%' strokeWidth={0.1} fill='white'/>
          </div>
        )}
        
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>{viewUser.name}</h2>
        </div>
      </div>

      <hr style={{ borderColor: 'gray', opacity: 0.3 }} />
      
      <h3>Models ({userModels.length}):</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {userModels.length === 0 ? <p>This user has not published any models yet.</p> : userModels.map(m => (
          <div key={m._id} className="model-card" style={{ height: 'auto', paddingBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</h3>
            
            <div style={{ height: '200px', backgroundColor: '#000', borderRadius: '8px', marginBottom: '10px' }}>
              <ModelViewer url={m.fileUrl} />
            </div>
            
            <Link to={`/model/${m._id}`}>
              <button style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                View model
              </button>
            </Link>
          </div>
        ))}
      </div>
      
    </div>
  );
}