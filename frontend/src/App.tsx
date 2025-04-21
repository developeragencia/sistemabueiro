import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
`;

const Header = styled.header`
  background-color: #343a40;
  padding: 1rem;
  color: white;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`;

const Footer = styled.footer`
  background-color: #343a40;
  padding: 1rem;
  color: white;
  margin-top: auto;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Header>
          <h1>Bueiro2029</h1>
          <p>Sistema de Monitoramento de Bueiros Inteligentes</p>
        </Header>
        
        <MainContent>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h2>Bem-vindo ao Sistema</h2>
                <p>
                  O Bueiro2029 é uma solução completa para monitoramento e gerenciamento de bueiros inteligentes.
                  Com nossa plataforma, você pode:
                </p>
                <ul className="text-start">
                  <li>Monitorar o status dos bueiros em tempo real</li>
                  <li>Receber alertas de manutenção</li>
                  <li>Gerenciar equipes de manutenção</li>
                  <li>Analisar dados históricos</li>
                </ul>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3>Login</h3>
                    <form>
                      <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email" />
                      </div>
                      <div className="mb-3">
                        <input type="password" className="form-control" placeholder="Senha" />
                      </div>
                      <button type="submit" className="btn btn-primary">Entrar</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainContent>

        <Footer>
          <p>&copy; 2024 Bueiro2029 - Todos os direitos reservados</p>
        </Footer>
      </AppContainer>
    </Router>
  );
};

export default App; 