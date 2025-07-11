import React, { useState, useEffect } from "react";
import { projectApi } from "../services/api";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'active',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getAll();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0
      };
      await projectApi.create(projectData);
      setFormData({
        name: '',
        client: '',
        budget: '',
        start_date: '',
        end_date: '',
        status: 'active',
        description: ''
      });
      setShowForm(false);
      await loadProjects(); // Reload projects
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
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

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.delete(projectId);
        await loadProjects(); // Reload projects
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project');
      }
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await projectApi.update(projectId, { status: newStatus });
      await loadProjects(); // Reload projects
    } catch (err) {
      console.error('Error updating project status:', err);
      setError('Failed to update project status');
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
      <div className="projects">
        <div className="projects-container">
          <div className="loading">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects">
      <div className="projects-container">
        <div className="projects-header">
          <h2>Projects</h2>
          <button 
            className="add-project-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Project
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadProjects}>Retry</button>
          </div>
        )}

        {showForm && (
          <div className="project-form-container">
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
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
                  {submitting ? 'Adding...' : 'Add Project'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status}
                </span>
              </div>
              <div className="project-info">
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
                <p><strong>Start Date:</strong> {formatDate(project.start_date)}</p>
                {project.end_date && <p><strong>End Date:</strong> {formatDate(project.end_date)}</p>}
                {project.description && <p><strong>Description:</strong> {project.description}</p>}
              </div>
              <div className="project-actions">
                <div className="status-actions">
                  <button onClick={() => handleStatusChange(project.id, 'active')}>
                    Active
                  </button>
                  <button onClick={() => handleStatusChange(project.id, 'completed')}>
                    Completed
                  </button>
                  <button onClick={() => handleStatusChange(project.id, 'on-hold')}>
                    On Hold
                  </button>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="empty-state">
            <p>No projects found. Add your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;