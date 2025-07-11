import React, { useState, useEffect } from "react";
import { dashboardApi } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getStats();
      setStats({
        totalClients: data.total_clients,
        activeProjects: data.active_projects,
        totalRevenue: data.total_revenue
      });
      setRecentClients(data.recent_clients);
      setRecentProjects(data.recent_projects);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="error">
            <p>{error}</p>
            <button onClick={loadDashboardData}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        
        <div className="stats-grid">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Clients</h3>
              <p className="stat-number">{stats.totalClients}</p>
            </div>
          </div>
          
          <div className="stat-card stat-card-green">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Active Projects</h3>
              <p className="stat-number">{stats.activeProjects}</p>
            </div>
          </div>
          
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-number">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h3>Recent Clients</h3>
            <div className="recent-list">
              {recentClients.length > 0 ? (
                recentClients.map((client) => (
                  <div key={client.id} className="recent-item">
                    <div className="recent-item-avatar">
                      {client.name.charAt(0)}
                    </div>
                    <div className="recent-item-info">
                      <h4>{client.name}</h4>
                      <p>{client.email}</p>
                      <small>Joined: {formatDate(client.join_date)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">No recent clients</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h3>Recent Projects</h3>
            <div className="recent-list">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="recent-item">
                    <div className="recent-item-info">
                      <h4>{project.name}</h4>
                      <p>{project.client}</p>
                      <span className={`status-badge status-${project.status}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">No recent projects</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;