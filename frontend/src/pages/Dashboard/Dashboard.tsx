import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total de Bueiros</h3>
            <p className="text-3xl font-bold text-blue-600">150</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Bueiros Ativos</h3>
            <p className="text-3xl font-bold text-green-600">142</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Alertas</h3>
            <p className="text-3xl font-bold text-yellow-600">8</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Últimos Alertas</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((alert) => (
              <div key={alert} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Bueiro #{alert}</h3>
                    <p className="text-sm text-gray-500">Nível de água alto</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Crítico
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Há 2 horas</p>
              </div>
            ))}
          </div>
          <Link
            to="/alertas"
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark"
          >
            Ver todos os alertas →
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manutenções Pendentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((maintenance) => (
              <div key={maintenance} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Bueiro #{maintenance}</h3>
                    <p className="text-sm text-gray-500">Limpeza programada</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Agendado para amanhã</p>
              </div>
            ))}
          </div>
          <Link
            to="/manutencoes"
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark"
          >
            Ver todas as manutenções →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 