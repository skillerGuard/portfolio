import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectGrid from './components/ProjectGrid';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className="background-glow"></div>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectGrid />
      </main>
      <Footer />
    </>
  );
}

export default App;
