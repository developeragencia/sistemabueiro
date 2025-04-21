import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Bueiro {
  id: number;
  codigo: string;
  localizacao: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  ultimaManutencao: string;
  latitude: number;
  longitude: number;
  nivelAgua: number;
  temperatura: number;
  umidade: number;
  pressao: number;
}

const DetalhesBueiro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bueiro, setBueiro] = useState<Bueiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implementar chamada à API
    // const fetchBueiro = async () => {
    //   try {
    //     const response = await api.get(`/bueiros/${id}`);
    //     setBueiro(response.data);
    //   } catch (error) {
    //     console.error('Erro ao buscar dados do bueiro:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchBueiro();

    // Dados mockados para demonstração
    setTimeout(() => {
      setBueiro({
        id: Number(id),
        codigo: 'B001',
        localizacao: 'Rua Principal, 123',
        status: 'ativo',
        ultimaManutencao: '2024-03-01',
        latitude: -23.5505,
        longitude: -46.6333,
        nivelAgua: 45,
        temperatura: 25,
        umidade: 60,
        pressao: 1013,
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bueiro) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Bueiro não encontrado</h2>
        <p className="mt-2 text-gray-600">O bueiro solicitado não existe ou foi removido.</p>
        <Link
          to="/bueiros"
          className="mt-4 inline-block btn btn-primary"
        >
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Bueiro {bueiro.codigo}
        </h1>
        <div className="flex space-x-4">
          <Link
            to={`/bueiros/${id}/editar`}
            className="btn btn-primary"
          >
            Editar
          </Link>
          <Link
            to="/bueiros"
            className="btn btn-secondary"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações Gerais</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Localização</dt>
              <dd className="mt-1 text-sm text-gray-900">{bueiro.localizacao}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bueiro.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : bueiro.status === 'inativo'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {bueiro.status.charAt(0).toUpperCase() + bueiro.status.slice(1)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Última Manutenção</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(bueiro.ultimaManutencao).toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Coordenadas</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {bueiro.latitude}, {bueiro.longitude}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dados em Tempo Real</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nível de Água</dt>
              <dd className="mt-1 text-sm text-gray-900">{bueiro.nivelAgua}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Temperatura</dt>
              <dd className="mt-1 text-sm text-gray-900">{bueiro.temperatura}°C</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Umidade</dt>
              <dd className="mt-1 text-sm text-gray-900">{bueiro.umidade}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pressão</dt>
              <dd className="mt-1 text-sm text-gray-900">{bueiro.pressao} hPa</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Alertas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  01/03/2024 14:30
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Nível de Água Alto
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Nível de água atingiu 80% da capacidade
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Crítico
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetalhesBueiro; 