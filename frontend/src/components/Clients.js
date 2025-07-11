import React, { useState, useEffect } from "react";
import { clientApi } from "../services/api";
import "./Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientApi.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingClient) {
        await clientApi.update(editingClient.id, formData);
      } else {
        await clientApi.create(formData);
      }
      resetForm();
      await loadClients();
    } catch (err) {
      console.error('Error saving client:', err);
      setError('Failed to save client');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '' });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || ''
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientApi.delete(clientId);
        await loadClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        setError('Failed to delete client');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="clients">
        <div className="clients-container">
          <div className="loading">Loading clients...</div>
        </div>
      </div>
    );
  }

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

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadClients}>Retry</button>
          </div>
        )}

        {showForm && (
          <div className="client-form-container">
            <form onSubmit={handleSubmit} className="client-form">
              <h3>{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
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
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
                </button>
                <button type="button" onClick={resetForm}>Cancel</button>
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
                {client.phone && <p>{client.phone}</p>}
                {client.company && <p>{client.company}</p>}
                <small>Joined: {formatDate(client.join_date)}</small>
              </div>
              <div className="client-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(client)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(client.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <div className="empty-state">
            <p>No clients found. Add your first client to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;