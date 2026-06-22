import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-content">
        <div className="footer-logo">
          <h2 className="text-gradient">skillerguard's games</h2>
          <p>Crafting worlds, one pixel at a time.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/skillerGuard" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} skillerguard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
