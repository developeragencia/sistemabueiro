import React from 'react';
import './Integracoes.css';

function Integracoes() {
  const integracoes = [
    {
      nome: 'Google Analytics',
      descricao: 'Integre seus dados de UTM com o Google Analytics para análises avançadas.',
      icone: '📊'
    },
    {
      nome: 'Facebook Ads',
      descricao: 'Conecte suas campanhas do Facebook Ads para rastreamento completo.',
      icone: '📱'
    },
    {
      nome: 'Google Ads',
      descricao: 'Integre suas campanhas do Google Ads para otimização de conversões.',
      icone: '🔍'
    },
    {
      nome: 'Mailchimp',
      descricao: 'Conecte suas campanhas de email com o Mailchimp para rastreamento de cliques.',
      icone: '✉️'
    },
    {
      nome: 'HubSpot',
      descricao: 'Integre com o HubSpot para automação de marketing e CRM.',
      icone: '🔄'
    },
    {
      nome: 'Zapier',
      descricao: 'Conecte com milhares de aplicativos através do Zapier.',
      icone: '⚡'
    }
  ];

  return (
    <div className="integracoes-page">
      <div className="container">
        <h1>Integrações</h1>
        <p className="page-description">
          Conecte suas ferramentas favoritas e otimize seu fluxo de trabalho.
        </p>
        <div className="integracoes-grid">
          {integracoes.map((integracao, index) => (
            <div key={index} className="integracao-card">
              <div className="integracao-icone">{integracao.icone}</div>
              <h3>{integracao.nome}</h3>
              <p>{integracao.descricao}</p>
              <button className="btn-integracao">Conectar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Integracoes; 