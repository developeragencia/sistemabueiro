import React from 'react';
import './Dashboard.css';

function Dashboard() {
  const metricas = [
    {
      titulo: 'Total de Cliques',
      valor: '12,345',
      variacao: '+12%',
      positivo: true
    },
    {
      titulo: 'Taxa de Conversão',
      valor: '3.2%',
      variacao: '+0.5%',
      positivo: true
    },
    {
      titulo: 'Custo por Clique',
      valor: 'R$ 0.45',
      variacao: '-0.10',
      positivo: true
    },
    {
      titulo: 'ROI',
      valor: '4.2x',
      variacao: '+0.8x',
      positivo: true
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>
        <div className="metricas-grid">
          {metricas.map((metrica, index) => (
            <div key={index} className="metrica-card">
              <h3>{metrica.titulo}</h3>
              <div className="metrica-valor">
                <span className="valor">{metrica.valor}</span>
                <span className={`variacao ${metrica.positivo ? 'positivo' : 'negativo'}`}>
                  {metrica.variacao}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="graficos-grid">
          <div className="grafico-card">
            <h3>Cliques por Dia</h3>
            <div className="grafico-placeholder">
              {/* Aqui você implementaria um gráfico real */}
              <p>Gráfico de Cliques</p>
            </div>
          </div>
          <div className="grafico-card">
            <h3>Conversões por Fonte</h3>
            <div className="grafico-placeholder">
              {/* Aqui você implementaria um gráfico real */}
              <p>Gráfico de Conversões</p>
            </div>
          </div>
        </div>

        <div className="campanhas-recentes">
          <h3>Campanhas Recentes</h3>
          <div className="tabela-campanhas">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cliques</th>
                  <th>Conversões</th>
                  <th>CTR</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Campanha de Verão</td>
                  <td>1,234</td>
                  <td>45</td>
                  <td>3.6%</td>
                  <td className="ativo">Ativo</td>
                </tr>
                <tr>
                  <td>Promoção Especial</td>
                  <td>2,345</td>
                  <td>78</td>
                  <td>3.3%</td>
                  <td className="ativo">Ativo</td>
                </tr>
                <tr>
                  <td>Lançamento Produto</td>
                  <td>3,456</td>
                  <td>123</td>
                  <td>3.5%</td>
                  <td className="pausado">Pausado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 