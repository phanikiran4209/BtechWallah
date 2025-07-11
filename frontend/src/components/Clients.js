import React, { useState, useEffect } from "react";
import { mockData } from "../data/mockData";
import "./Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  useEffect(() => {
    setClients(mockData.clients);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      id: Date.now(),
      ...formData,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setClients([newClient, ...clients]);
    setFormData({ name: '', email: '', phone: '', company: '' });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="clients">
      <div className="clients-container">
        <div className="clients-header">
          <h2>Clients</h2>
          <button 
            className="add-client-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Client
          </button>
        </div>

        {showForm && (
          <div className="client-form-container">
            <form onSubmit={handleSubmit} className="client-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit">Add Client</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-avatar">
                {client.name.charAt(0)}
              </div>
              <div className="client-info">
                <h3>{client.name}</h3>
                <p>{client.email}</p>
                <p>{client.phone}</p>
                <p>{client.company}</p>
                <small>Joined: {client.joinDate}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;