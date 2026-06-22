import React from 'react';
import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

// We will use the generated images and some placeholder text for the demo.
const projects = [
  {
    id: 1,
    title: 'Neon Drift',
    description: 'A high-octane cyberpunk RPG with deep narrative and fast-paced combat mechanics.',
    image: '/cyber_rpg_cover.png',
    tags: ['RPG', 'Sci-Fi', 'Godot']
  },
  {
    id: 2,
    title: 'Lumina',
    description: 'A magical pixel art platformer where you control the light to solve ancient puzzles.',
    image: '/pixel_hero_cover.png',
    tags: ['Platformer', 'Pixel Art', 'Unity']
  },
  {
    id: 3,
    title: 'Chipmunk Go!',
    description: 'An endless pixel-art runner with a custom physics engine and moving elevators.',
    image: '/chipmunk-go/assets/bg.png',
    link: '/chipmunk-go/index.html',
    tags: ['Web Game', 'Vanilla JS', 'Canvas']
  }
];

const ProjectGrid = () => {
  return (
    <section id="games" className="container projects-section">
      <h2 className="section-title">My <span className="text-gradient">Games</span></h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
