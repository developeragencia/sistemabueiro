import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            Bueiro Digital
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/integracoes">Integrações</Link>
            <Link to="/precos">Preços</Link>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Registrar</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header; 