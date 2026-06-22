import React from 'react';
import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

const projects = [];

const ProjectGrid = () => {
  return (
    <section id="games" className="container projects-section">
      <h2 className="section-title">My <span className="text-gradient">Games</span></h2>
      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          <p>More exciting games coming soon!</p>
        </div>
      )}
    </section>
  );
};

export default ProjectGrid;
