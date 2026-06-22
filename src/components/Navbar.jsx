import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <a href="#" className="logo text-gradient">skillerguard's games</a>
        <div className="nav-links">
          <a href="#games">Games</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
