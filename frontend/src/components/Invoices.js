import React, { useState, useEffect } from "react";
import { mockData } from "../data/mockData";
import "./Invoices.css";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    description: ''
  });

  useEffect(() => {
    setInvoices(mockData.invoices);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      createdDate: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Date.now()}`
    };
    setInvoices([newInvoice, ...invoices]);
    setFormData({
      client: '',
      project: '',
      amount: '',
      dueDate: '',
      status: 'pending',
      description: ''
    });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: newStatus } : invoice
    ));
  };

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
                    name="dueDate"
                    value={formData.dueDate}
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
                <button type="submit">Create Invoice</button>
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
                  <h3>{invoice.invoiceNumber}</h3>
                  <p>{invoice.client}</p>
                </div>
                <div className="invoice-amount">
                  <h2>${invoice.amount.toLocaleString()}</h2>
                </div>
              </div>
              <div className="invoice-info">
                <p><strong>Project:</strong> {invoice.project}</p>
                <p><strong>Due Date:</strong> {invoice.dueDate}</p>
                <p><strong>Created:</strong> {invoice.createdDate}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invoices;