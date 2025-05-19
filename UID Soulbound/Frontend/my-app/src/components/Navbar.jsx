import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ walletConnected, walletAddress, connectWallet }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Handle responsive menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Truncate wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-icon"></div>
          <span className="logo-text">SoulID</span>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          
          <div className="navbar-actions">
            {walletConnected ? (
              <div className="wallet-pill">
                <div className="wallet-icon"></div>
                <span className="wallet-address">{formatAddress(walletAddress)}</span>
              </div>
            ) : (
              <button className="connect-wallet-button" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${menuOpen ? 'animate' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'animate' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'animate' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;