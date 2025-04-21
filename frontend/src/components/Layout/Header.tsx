import React from 'react';
import { Link } from 'react-router-dom';
import { Usuario } from '../../types';

interface HeaderProps {
  usuario: Usuario | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ usuario, onSignOut }) => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Bueiro2029
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-gray-200">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/bueiros" className="hover:text-gray-200">
                  Bueiros
                </Link>
              </li>
              <li>
                <Link to="/alertas" className="hover:text-gray-200">
                  Alertas
                </Link>
              </li>
              <li>
                <Link to="/relatorios" className="hover:text-gray-200">
                  Relatórios
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {usuario ? (
              <>
                <span className="text-sm">
                  Olá, {usuario.nome}
                </span>
                <button
                  onClick={onSignOut}
                  className="btn btn-secondary"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-secondary">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 