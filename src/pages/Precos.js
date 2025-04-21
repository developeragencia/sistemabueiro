import React from 'react';
import { Link } from 'react-router-dom';
import './Precos.css';

function Precos() {
  const planos = [
    {
      nome: 'Básico',
      preco: 'R$ 49',
      periodo: '/mês',
      recursos: [
        '5.000 cliques/mês',
        '3 integrações',
        'Relatórios básicos',
        'Suporte por email',
        '1 usuário'
      ],
      destaque: false
    },
    {
      nome: 'Profissional',
      preco: 'R$ 99',
      periodo: '/mês',
      recursos: [
        '20.000 cliques/mês',
        '10 integrações',
        'Relatórios avançados',
        'Suporte prioritário',
        '5 usuários',
        'API access'
      ],
      destaque: true
    },
    {
      nome: 'Empresarial',
      preco: 'R$ 199',
      periodo: '/mês',
      recursos: [
        '100.000 cliques/mês',
        'Integrações ilimitadas',
        'Relatórios personalizados',
        'Suporte 24/7',
        'Usuários ilimitados',
        'API access',
        'Consultoria'
      ],
      destaque: false
    }
  ];

  return (
    <div className="precos-page">
      <div className="container">
        <h1>Planos e Preços</h1>
        <p className="page-description">
          Escolha o plano ideal para o seu negócio
        </p>
        <div className="planos-grid">
          {planos.map((plano, index) => (
            <div
              key={index}
              className={`plano-card ${plano.destaque ? 'destaque' : ''}`}
            >
              <div className="plano-header">
                <h3>{plano.nome}</h3>
                <div className="plano-preco">
                  <span className="valor">{plano.preco}</span>
                  <span className="periodo">{plano.periodo}</span>
                </div>
              </div>
              <ul className="plano-recursos">
                {plano.recursos.map((recurso, i) => (
                  <li key={i}>{recurso}</li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`btn-plano ${plano.destaque ? 'btn-destaque' : ''}`}
              >
                Começar Agora
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Precos; 