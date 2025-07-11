import React, { useState, useEffect } from "react";
import { invoiceApi, clientApi, projectApi } from "../services/api";
import InvoiceGenerator from "./InvoiceGenerator";
import "./Invoices.css";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    amount: '',
    due_date: '',
    status: 'pending',
    description: '',
    company_name: '',
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    hours: '',
    rate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInvoices();
    loadClients();
    loadProjects();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceApi.getAll();
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error loading invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientApi.getAll();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await projectApi.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0
      };
      
      if (editingInvoice) {
        await invoiceApi.update(editingInvoice.id, invoiceData);
      } else {
        await invoiceApi.create(invoiceData);
      }
      
      resetForm();
      await loadInvoices();
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('Failed to save invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client: '',
      project: '',
      amount: '',
      due_date: '',
      status: 'pending',
      description: '',
      company_name: '',
      agent_name: '',
      agent_phone: '',
      agent_email: '',
      hours: '',
      rate: ''
    });
    setEditingInvoice(null);
    setShowForm(false);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      client: invoice.client,
      project: invoice.project,
      amount: invoice.amount.toString(),
      due_date: invoice.due_date,
      status: invoice.status,
      description: invoice.description || '',
      company_name: invoice.company_name || '',
      agent_name: invoice.agent_name || '',
      agent_phone: invoice.agent_phone || '',
      agent_email: invoice.agent_email || '',
      hours: invoice.hours?.toString() || '',
      rate: invoice.rate?.toString() || ''
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate amount if hours and rate are provided
    if (name === 'hours' || name === 'rate') {
      const hours = name === 'hours' ? parseFloat(value) || 0 : parseFloat(formData.hours) || 0;
      const rate = name === 'rate' ? parseFloat(value) || 0 : parseFloat(formData.rate) || 0;
      const calculatedAmount = hours * rate;
      
      if (calculatedAmount > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          amount: calculatedAmount.toString()
        }));
      }
    }
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceApi.delete(invoiceId);
        await loadInvoices();
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice');
      }
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await invoiceApi.update(invoiceId, { status: newStatus });
      await loadInvoices();
    } catch (err) {
      console.error('Error updating invoice status:', err);
      setError('Failed to update invoice status');
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

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : clientId;
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  const handleGenerateInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  if (loading) {
    return (
      <div className="invoices">
        <div className="invoices-container">
          <div className="loading">Loading invoices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="invoices">
      <div className="invoices-container">
        <div className="invoices-header">
          <h2>Invoices</h2>
          <button 
            className="add-invoice-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Create Invoice
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadInvoices}>Retry</button>
          </div>
        )}

        {showForm && (
          <div className="invoice-form-container">
            <form onSubmit={handleSubmit} className="invoice-form">
              <h3>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h3>
              
              <div className="form-section">
                <h4>Company Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Agent Name</label>
                    <input
                      type="text"
                      name="agent_name"
                      value={formData.agent_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Agent Phone</label>
                    <input
                      type="tel"
                      name="agent_phone"
                      value={formData.agent_phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Agent Email</label>
                    <input
                      type="email"
                      name="agent_email"
                      value={formData.agent_email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Invoice Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Client</label>
                    <select
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project</label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hours</label>
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Rate per Hour</label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingInvoice ? 'Update Invoice' : 'Create Invoice')}
                </button>
                <button type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="invoices-list">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="invoice-card">
              <div className="invoice-header">
                <div className="invoice-number">
                  <h3>{invoice.invoice_number}</h3>
                  <p>{getClientName(invoice.client)}</p>
                </div>
                <div className="invoice-amount">
                  <h2>${invoice.amount.toLocaleString()}</h2>
                </div>
              </div>
              <div className="invoice-info">
                <p><strong>Project:</strong> {getProjectName(invoice.project)}</p>
                <p><strong>Due Date:</strong> {formatDate(invoice.due_date)}</p>
                <p><strong>Created:</strong> {formatDate(invoice.created_date)}</p>
                {invoice.description && <p><strong>Description:</strong> {invoice.description}</p>}
              </div>
              <div className="invoice-actions">
                <span className={`status-badge status-${invoice.status}`}>
                  {invoice.status}
                </span>
                <div className="status-actions">
                  <button onClick={() => updateInvoiceStatus(invoice.id, 'pending')}>
                    Pending
                  </button>
                  <button onClick={() => updateInvoiceStatus(invoice.id, 'paid')}>
                    Paid
                  </button>
                  <button onClick={() => updateInvoiceStatus(invoice.id, 'overdue')}>
                    Overdue
                  </button>
                </div>
                <div className="action-buttons">
                  <button 
                    className="generate-btn"
                    onClick={() => handleGenerateInvoice(invoice)}
                  >
                    View Invoice
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(invoice)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && !loading && (
          <div className="empty-state">
            <p>No invoices found. Create your first invoice to get started!</p>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceGenerator
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Invoices;