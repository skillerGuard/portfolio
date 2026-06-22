import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero container">
      <div className="hero-content animate-fade-in-up">
        <h1 className="hero-title">
          Welcome to <span className="text-gradient">skillerguard's</span> universe.
        </h1>
        <p className="hero-subtitle">
          I'm an indie game developer crafting immersive experiences, vibrant worlds, and engaging mechanics. Explore my latest projects below.
        </p>
        <div className="hero-actions">
          <a href="#games" className="btn btn-primary">Play My Games</a>
          <a href="https://github.com/skillerGuard" target="_blank" rel="noreferrer" className="btn glass-panel hero-btn">View GitHub</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
