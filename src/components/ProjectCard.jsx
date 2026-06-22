import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card glass-panel">
      <div className="card-image-container">
        <img src={project.image} alt={project.title} className="card-image" />
        <div className="card-overlay">
          <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary play-btn">
            Play Now
          </a>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-description">{project.description}</p>
        <div className="card-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
