import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Clock, User, PlusCircle, CheckCircle } from 'lucide-react';

export default function JobBoard({ user }) {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState(3); 

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!user) return alert("Only authorized users can create orders!");

    try {
      await axios.post('http://localhost:5000/api/orders', {
        title,
        description,
        customerId: user.userId || user._id,
        daysToComplete: days
      });
      
      alert("Order successfully created!");
      setShowForm(false);
      setTitle('');
      setDescription('');
      setDays(3);
      fetchOrders();
    } catch (err) {
      console.error("Creation error:", err);
      alert("Failed to create order.");
    }
  };

  const handleTakeOrder = async (orderId) => {
    if (!user) return alert("Log in to take orders!");
    
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/take`, {
        workerId: user.userId || user._id
      });
      
      alert("You have successfully taken the order! It is now in your profile.");
      fetchOrders(); 
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.error || "Unable to take order.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #334155', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={32} color="#3b82f6" /> Order Exchange
          </h1>
          <p style={{ color: 'gray', margin: 0 }}>Look for performers for your ideas or take orders yourself!</p>
        </div>
        
        {user && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: showForm ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
          >
            <PlusCircle size={20} /> {showForm ? 'Cancel' : 'Create an order'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrder} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>New order</h3>
          
          <input 
            type="text" placeholder="What do you need to model? (Example: 3D model of a sword)" 
            value={title} onChange={e => setTitle(e.target.value)} required
            style={{ width: '95%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
          />
          
          <textarea 
            placeholder="Describe the details: style, polygonality, dimensions..." 
            value={description} onChange={e => setDescription(e.target.value)} required rows="4"
            style={{ width: '95%', padding: '10px',  marginBottom: '15px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <label>How many days do you allow for completion?</label>
            <input 
              type="number" min="1" max="30" value={days} onChange={e => setDays(e.target.value)} required
              style={{ padding: '8px', width: '80px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          </div>
          
          <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Publish task
          </button>
        </form>
      )}

      <div>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: '#1e293b', borderRadius: '12px' }}>
            <h3 style={{ color: 'gray' }}>There are no open orders yet. Be the first!</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <h2 style={{ margin: '0 0 10px 0', color: '#60a5fa' }}>{order.title}</h2>
                  <p style={{ margin: '0 0 15px 0', lineHeight: '1.5' }}>{order.description}</p>
                  
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={16} /> From: {order.customer?.name || 'Anonym'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={16} /> Deadline: {new Date(order.deadline).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>
                
                {user && (user.userId || user._id) !== order.customer?._id ? (
                  <button 
                    onClick={() => handleTakeOrder(order._id)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
                  >
                    <CheckCircle size={20} /> Take to work
                  </button>
                ) : (
                   <div style={{ color: 'gray', fontSize: '14px', fontStyle: 'italic' }}>Your order</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}