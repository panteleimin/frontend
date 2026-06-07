import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AllUsers({ search }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/users?search=${search}`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, [search]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Users</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {users.length === 0 ? <h3>No users found</h3> : users.map(u => (
          <div key={u._id} className="model-card">
            <h3 style={{ margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</h3>
            <div style={{padding: '20px'}}>
                {u.icon ? (
                    <img 
                    src={`https://threedhub-backend.onrender.com${u.icon}`} 
                    alt="Аватар" 
                    style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover' }} 
                />) : (
                    <div style={{width: '220px', height: '220px', borderRadius: '50%', background: '#999999'}}/>
                )}
            </div>
            <Link to={`/user/${u._id}`}>
              <button style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                View user
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}