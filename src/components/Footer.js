import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Bueiro Digital</h3>
            <p>A plataforma mais completa para rastreamento de UTMs e gestão de campanhas de marketing.</p>
          </div>
          <div className="footer-section">
            <h3>Links Rápidos</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/integracoes">Integrações</a></li>
              <li><a href="/precos">Preços</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contato</h3>
            <p>Email: contato@bueirodigital.com</p>
            <p>Telefone: (11) 99999-9999</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Bueiro Digital. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 