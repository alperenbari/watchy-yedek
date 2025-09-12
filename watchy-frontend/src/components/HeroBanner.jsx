import React from 'react';
import './HeroBanner.css';
import backgroundImage from '../assets/herobanner.png';
import logo from '../assets/logo.png';

const HeroBanner = ({ title }) => {
  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logo} alt="Watchy Logo" className="hero-logo" />
      <div className="hero-banner-content">
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default HeroBanner;