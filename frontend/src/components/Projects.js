import React, { useState, useEffect } from "react";
import { mockData } from "../data/mockData";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: 'active',
    description: ''
  });

  useEffect(() => {
    setProjects(mockData.projects);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      ...formData,
      budget: parseFloat(formData.budget) || 0
    };
    setProjects([newProject, ...projects]);
    setFormData({
      name: '',
      client: '',
      budget: '',
      startDate: '',
      endDate: '',
      status: 'active',
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
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
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
                <button type="submit">Add Project</button>
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
                <p><strong>Start Date:</strong> {project.startDate}</p>
                {project.endDate && <p><strong>End Date:</strong> {project.endDate}</p>}
                {project.description && <p><strong>Description:</strong> {project.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;