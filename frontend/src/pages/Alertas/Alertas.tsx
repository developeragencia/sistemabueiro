import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Alerta {
  id: number;
  bueiroId: number;
  bueiroCodigo: string;
  tipo: string;
  descricao: string;
  data: string;
  status: 'pendente' | 'resolvido' | 'falso-positivo';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
}

const Alertas: React.FC = () => {
  const [alertas] = useState<Alerta[]>([
    {
      id: 1,
      bueiroId: 1,
      bueiroCodigo: 'B001',
      tipo: 'Nível de Água Alto',
      descricao: 'Nível de água atingiu 80% da capacidade',
      data: '2024-03-01T14:30:00',
      status: 'pendente',
      prioridade: 'critica',
    },
    {
      id: 2,
      bueiroId: 2,
      bueiroCodigo: 'B002',
      tipo: 'Temperatura Elevada',
      descricao: 'Temperatura acima do normal',
      data: '2024-03-01T15:45:00',
      status: 'resolvido',
      prioridade: 'media',
    },
    {
      id: 3,
      bueiroId: 3,
      bueiroCodigo: 'B003',
      tipo: 'Falha de Sensor',
      descricao: 'Sensor de nível de água não responde',
      data: '2024-03-02T09:15:00',
      status: 'pendente',
      prioridade: 'alta',
    },
  ]);

  const getPrioridadeColor = (prioridade: Alerta['prioridade']) => {
    switch (prioridade) {
      case 'critica':
        return 'bg-red-100 text-red-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Alerta['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolvido':
        return 'bg-green-100 text-green-800';
      case 'falso-positivo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
        <div className="flex space-x-4">
          <button className="btn btn-primary">Filtrar</button>
          <button className="btn btn-secondary">Exportar</button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bueiro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alertas.map((alerta) => (
                <tr key={alerta.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      to={`/bueiros/${alerta.bueiroId}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      {alerta.bueiroCodigo}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alerta.tipo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {alerta.descricao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(alerta.data).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPrioridadeColor(
                        alerta.prioridade
                      )}`}
                    >
                      {alerta.prioridade.charAt(0).toUpperCase() + alerta.prioridade.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        alerta.status
                      )}`}
                    >
                      {alerta.status.charAt(0).toUpperCase() + alerta.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark mr-4">
                      Resolver
                    </button>
                    <button className="text-primary hover:text-primary-dark">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alertas; 