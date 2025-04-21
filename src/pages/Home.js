import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Rastreamento de UTM Simplificado</h1>
            <p>
              A plataforma mais completa para rastreamento de UTMs e gestão de campanhas de marketing.
              Aumente sua conversão e otimize seus resultados.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Começar Agora</Link>
              <Link to="/precos" className="btn-secondary">Ver Planos</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Recursos Principais</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Rastreamento em Tempo Real</h3>
              <p>Monitore suas campanhas em tempo real e tome decisões baseadas em dados.</p>
            </div>
            <div className="feature-card">
              <h3>Integrações Simples</h3>
              <p>Conecte-se facilmente com suas ferramentas favoritas de marketing.</p>
            </div>
            <div className="feature-card">
              <h3>Relatórios Detalhados</h3>
              <p>Obtenha insights valiosos com relatórios personalizados e dashboards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 