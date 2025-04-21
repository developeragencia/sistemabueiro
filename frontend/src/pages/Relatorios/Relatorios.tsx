import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Relatorios: React.FC = () => {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d'>('7d');

  const dadosGrafico = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Nível de Água (%)',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Temperatura (°C)',
        data: [28, 29, 30, 31, 30, 29, 28],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Métricas dos Bueiros',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <div className="flex space-x-4">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as '7d' | '30d' | '90d')}
            className="input"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          <button className="btn btn-primary">Exportar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total de Alertas</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">24</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Alertas Críticos</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">8</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Manutenções Realizadas</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tempo Médio de Resposta</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">2h 30m</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Distribuição de Alertas</h2>
          <div className="h-64">
            <Line data={dadosGrafico} options={opcoesGrafico} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Bueiros com Mais Alertas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bueiro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Alertas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alertas Críticos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Alerta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  B001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rua Principal, 123
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  01/03/2024 14:30
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  B002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Avenida Central, 456
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  28/02/2024 09:15
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Relatorios; 