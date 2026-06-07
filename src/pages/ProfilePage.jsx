import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ModelViewer from '../ModelViewer';
import { Bookmark, Grid, Briefcase, Upload, Download, CheckCircle, Clock } from 'lucide-react';

export default function ProfilePage({ user }) {
  const [myModels, setMyModels] = useState([]);
  const [savedModels, setSavedModels] = useState([]); 
  const [activeTab, setActiveTab] = useState('my');
  const [myOrders, setMyOrders] = useState([]);  
  
  const [glbFile, setGlbFile] = useState(null);
  const [fbxFile, setFbxFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = user.userId || user._id; 

      axios.get(`/api/models?userId=${userId}`)
        .then(res => setMyModels(res.data))
        .catch(err => console.error("Error (own):", err));

      axios.get(`/api/users/${userId}/saved-models`)
        .then(res => setSavedModels(res.data))
        .catch(err => console.error("Error (saved):", err));

      axios.get(`/api/users/${userId}/my-orders`)
        .then(res => setMyOrders(res.data))
        .catch(err => console.error("Помилка (замовлення):", err));
    }
  }, [user]);

  const handleDelete = async (modelid) => {
    const isconfirm = window.confirm('Are you sure about deleting?');
    if (isconfirm){
      try{
        await axios.delete(`/api/models/${modelid}`);
        setMyModels(prev => prev.filter(m => m._id !== modelid));
      } 
      catch(err) {
        console.error('Error while deleting', err);
      }
    }
  };

  const handleCompleteOrder = async (orderId) => {
    if (!glbFile && !fbxFile) {
      return alert("Виберіть хоча б один файл (.glb або .fbx) для здачі!");
    }

    setIsUploading(true);
    const formData = new FormData();
    if (glbFile) formData.append('glbOrderFile', glbFile);
    if (fbxFile) formData.append('fbxOrderFile', fbxFile);

    try {
      const res = await axios.put(`/api/orders/${orderId}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Роботу успішно здано!");
      setMyOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o));
      setGlbFile(null);
      setFbxFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Помилка при здачі роботи.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return <h2 style={{padding: '20px', textAlign: 'center'}}>Please log in!</h2>;

  const displayModels = activeTab === 'my' ? myModels : savedModels;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        {user.icon ? (
          <img src={`https://threedhub-backend.onrender.com${user.icon}`} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#616161', display: 'flex', justifyContent: 'center', alignItems: 'center' }}/>
        )}
        
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
          <p style={{ color: 'gray', margin: '0 0 10px 0' }}>{user.email}</p>
          <Link to={`/update-user/${user.userId || user._id}`}>
            <button style={{background: '#105fb9', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
              Edit profile
            </button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #334155', marginBottom: '20px', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('my')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '8px',
            color: activeTab === 'my' ? '#3b82f6' : 'gray' 
          }}
        >
          <Grid size={20} />
        </button>
        
        <button 
          onClick={() => setActiveTab('saved')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '8px',
            color: activeTab === 'saved' ? '#10b981' : 'gray' 
          }}
        >
          <Bookmark size={20} />
        </button>

        <button onClick={() => setActiveTab('orders')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: activeTab === 'orders' ? '#f59e0b' : 'gray'
        }}>
          <Briefcase size={20} />
        </button>
      </div>
      
      {activeTab !== 'orders' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {activeTab === 'my' && (
            <div style={{ marginBottom: '20px' }}>
              <Link to="/upload">
                <button style={{background: '#10b981', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                  + Download new model
                </button>
              </Link>
            </div>
          )}
      
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {displayModels.length === 0 ? (
              <p style={{ color: 'gray' }}>
                {activeTab === 'my' ? 'You have not uploaded any models yet.' : 'You have not bookmarked anything yet.'}
              </p>
            ) : (
              displayModels.map(m => (
                <div key={m._id} className="model-card" style={{ width: '300px', paddingBottom: '15px' }}>
                  <h3 style={{ margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</h3>
              
                  <div style={{ height: '200px', backgroundColor: '#000', borderRadius: '8px', marginBottom: '10px' }}>
                    <ModelViewer url={`https://threedhub-backend.onrender.com${m.fileUrl}`} />
                  </div>
              
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {activeTab === 'my' ? (
                      <>
                        <Link to={`/update/${m._id}`}><button style={{background: '#105fb9', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer'}}>Edit</button></Link>
                        <button onClick={() => handleDelete(m._id)} style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer'}}>Delete</button>
                      </>
                    ) : (
                      <Link to={`/model/${m._id}`} style={{ width: '100%' }}>
                        <button style={{width: '100%', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer'}}>
                          View page
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
      
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {myOrders.length === 0 ? (
            <p style={{ color: 'gray' }}>You have no orders yet.</p>
          ) : (
            myOrders.map(order => {
              const isCustomer = user.userId === order.customer._id || user._id === order.customer._id;
              const isWorker = user.userId === order.worker?._id || user._id === order.worker?._id;
              
              return (
                <div key={order._id} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${order.status === 'completed' ? '#10b981' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#e2e8f0' }}>{order.title}</h3>
                    <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: order.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: order.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                      {order.status === 'completed' ? 'Completed' : 'In progress'}
                    </span>
                  </div>
                  
                  <p style={{ color: '#94a3b8', margin: '0 0 15px 0' }}>{order.description}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: 'gray', marginBottom: '15px' }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Clock size={16}/> Deadline: {new Date(order.deadline).toLocaleDateString()}</span>
                    <span>Role: {isCustomer ? 'I am the Customer' : 'I am the Executor'}</span>
                  </div>

                  {isWorker && order.status === 'in-progress' && (
                    <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px dashed #475569' }}>
                      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#60a5fa' }}>Здати роботу:</p>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                         <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'gray' }}>
                           File .glb:
                           <input type="file" accept=".glb" onChange={e => setGlbFile(e.target.files[0])} style={{ marginTop: '5px' }} />
                         </label>
                         <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'gray' }}>
                           Файл .fbx:
                           <input type="file" accept=".fbx" onChange={e => setFbxFile(e.target.files[0])} style={{ marginTop: '5px' }} />
                         </label>
                         
                         <button 
                           onClick={() => handleCompleteOrder(order._id)}
                           disabled={isUploading || (!glbFile && !fbxFile)}
                           style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', background: isUploading ? 'gray' : '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: isUploading ? 'not-allowed' : 'pointer' }}
                         >
                           <Upload size={16} /> {isUploading ? 'Sending...' : 'Send to the customer'}
                         </button>
                      </div>
                    </div>
                  )}

                  {order.status === 'completed' && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <CheckCircle size={20} color="#10b981" />
                      <span style={{ color: '#e2e8f0' }}>The work is complete! The files are ready:</span>
                      
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                        {order.glbFileUrl && (
                          <a href={`https://threedhub-backend.onrender.com${order.glbFileUrl}`} download>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#475569', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}><Download size={14}/> .glb</button>
                          </a>
                        )}
                        {order.fbxFileUrl && (
                          <a href={`https://threedhub-backend.onrender.com${order.fbxFileUrl}`} download>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#475569', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}><Download size={14}/> .fbx</button>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}
      
    </div>
  );
}