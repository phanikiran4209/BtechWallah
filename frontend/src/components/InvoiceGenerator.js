import React from "react";
import "./InvoiceGenerator.css";

const InvoiceGenerator = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
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

  const calculateTotal = () => {
    return invoice.amount || 0;
  };

  return (
    <div className="invoice-generator-overlay">
      <div className="invoice-generator-container">
        <div className="invoice-header-actions">
          <button className="print-btn" onClick={handlePrint}>
            Print Invoice
          </button>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="invoice-document" id="invoice-document">
          <div className="invoice-header">
            <h1>Invoice #{invoice.invoice_number}</h1>
            <p className="invoice-date">Date: {formatDate(invoice.created_date)}</p>
          </div>

          <div className="invoice-parties">
            <div className="bill-from">
              <h3>From:</h3>
              <div className="company-info">
                <p><strong>{invoice.company_name || 'Your Company Name'}</strong></p>
                <p>{invoice.agent_name || 'Agent Name'}</p>
                <p>{invoice.agent_phone || 'Phone Number'}</p>
                <p>{invoice.agent_email || 'email@company.com'}</p>
              </div>
            </div>

            <div className="bill-to">
              <h3>Bill To:</h3>
              <div className="client-info">
                <p><strong>{invoice.client}</strong></p>
                <p>{invoice.client_email || 'client@email.com'}</p>
              </div>
            </div>
          </div>

          <div className="invoice-details">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="project-info">
                      <strong>{invoice.project}</strong>
                      <br />
                      <small>{invoice.description || 'Project description'}</small>
                    </div>
                  </td>
                  <td>{invoice.hours || '1'}</td>
                  <td>${invoice.rate || invoice.amount}/hr</td>
                  <td>${invoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Tax (0%):</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row total">
              <span><strong>Total Amount:</strong></span>
              <span><strong>${calculateTotal().toLocaleString()}</strong></span>
            </div>
          </div>

          <div className="invoice-footer">
            <div className="payment-info">
              <h4>Payment Information</h4>
              <p>Due Date: {formatDate(invoice.due_date)}</p>
              <p>Status: <span className={`status-${invoice.status}`}>{invoice.status.toUpperCase()}</span></p>
            </div>
            
            <div className="payment-terms">
              <h4>Thank you for your business!</h4>
              <p>Please process this payment within 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;