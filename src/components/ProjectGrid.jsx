import React from 'react';
import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

const projects = [
  {
    id: 3,
    title: 'Chipmunk Go!',
    description: 'An endless pixel-art runner with a custom physics engine and moving elevators.',
    image: '/chipmunk_go_cover.png',
    link: '/chipmunk-go/index.html',
    tags: ['Web Game', 'Vanilla JS', 'Canvas']
  }
];

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
