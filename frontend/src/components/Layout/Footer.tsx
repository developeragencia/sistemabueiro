import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Bueiro2029</h3>
            <p className="text-sm text-gray-300">
              Sistema de Monitoramento de Bueiros Inteligentes
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-300">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-gray-300">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-gray-300">
              Contato
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Bueiro2029. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 