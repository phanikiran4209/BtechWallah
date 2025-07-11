import React, { useState, useEffect } from "react";
import { invoiceApi } from "../services/api";
import "./Invoices.css";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    amount: '',
    due_date: '',
    status: 'pending',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInvoices();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0
      };
      await invoiceApi.create(invoiceData);
      setFormData({
        client: '',
        project: '',
        amount: '',
        due_date: '',
        status: 'pending',
        description: ''
      });
      setShowForm(false);
      await loadInvoices(); // Reload invoices
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceApi.delete(invoiceId);
        await loadInvoices(); // Reload invoices
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice');
      }
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await invoiceApi.update(invoiceId, { status: newStatus });
      await loadInvoices(); // Reload invoices
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
              <div className="form-row">
                <div className="form-group">
                  <label>Client</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Project</label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    required
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
                  {submitting ? 'Creating...' : 'Create Invoice'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
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
                  <p>{invoice.client}</p>
                </div>
                <div className="invoice-amount">
                  <h2>${invoice.amount.toLocaleString()}</h2>
                </div>
              </div>
              <div className="invoice-info">
                <p><strong>Project:</strong> {invoice.project}</p>
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
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(invoice.id)}
                >
                  Delete
                </button>
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
    </div>
  );
};

export default Invoices;