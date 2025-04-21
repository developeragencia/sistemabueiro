import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Bueiro {
  id: number;
  codigo: string;
  localizacao: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  ultimaManutencao: string;
}

const Bueiros: React.FC = () => {
  const [bueiros] = useState<Bueiro[]>([
    {
      id: 1,
      codigo: 'B001',
      localizacao: 'Rua Principal, 123',
      status: 'ativo',
      ultimaManutencao: '2024-03-01',
    },
    {
      id: 2,
      codigo: 'B002',
      localizacao: 'Avenida Central, 456',
      status: 'manutencao',
      ultimaManutencao: '2024-02-15',
    },
    {
      id: 3,
      codigo: 'B003',
      localizacao: 'Praça Central, 789',
      status: 'inativo',
      ultimaManutencao: '2024-01-20',
    },
  ]);

  const getStatusColor = (status: Bueiro['status']) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'manutencao':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bueiros</h1>
        <Link
          to="/bueiros/novo"
          className="btn btn-primary"
        >
          Adicionar Bueiro
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Manutenção
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bueiros.map((bueiro) => (
                <tr key={bueiro.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bueiro.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bueiro.localizacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        bueiro.status
                      )}`}
                    >
                      {bueiro.status.charAt(0).toUpperCase() + bueiro.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bueiro.ultimaManutencao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/bueiros/${bueiro.id}`}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      Detalhes
                    </Link>
                    <Link
                      to={`/bueiros/${bueiro.id}/editar`}
                      className="text-primary hover:text-primary-dark"
                    >
                      Editar
                    </Link>
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

export default Bueiros; 