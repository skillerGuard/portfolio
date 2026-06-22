import React from 'react';
import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

const projects = [
  {
    id: 1,
    title: 'Chipmunk Go!',
    description: 'An endless pixel-art runner with a custom physics engine and moving elevators.',
    image: '/portfolio/chipmunk_go_cover.png',
    link: 'https://skillerguard.github.io/portfolio/chipmunk-go/index.html',
    tags: ['Web Game', 'Vanilla JS', 'Canvas']
  },
  {
    id: 2,
    title: 'The Crawler',
    description: 'A terrifying first-person 3D horror experience with night vision and a stalking AI.',
    image: '/portfolio/the_crawler_cover.png',
    link: 'https://skillerguard.github.io/portfolio/the-crawler/index.html',
    tags: ['3D Game', 'Three.js', 'Horror', 'Web App']
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
