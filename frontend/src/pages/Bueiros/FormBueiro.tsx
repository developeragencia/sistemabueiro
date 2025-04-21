import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface BueiroFormData {
  codigo: string;
  localizacao: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  latitude: number;
  longitude: number;
}

const FormBueiro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState<BueiroFormData>({
    codigo: '',
    localizacao: '',
    status: 'ativo',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (isEditing) {
      // TODO: Implementar chamada à API
      // const fetchBueiro = async () => {
      //   try {
      //     const response = await api.get(`/bueiros/${id}`);
      //     setFormData(response.data);
      //   } catch (error) {
      //     console.error('Erro ao buscar dados do bueiro:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchBueiro();

      // Dados mockados para demonstração
      setTimeout(() => {
        setFormData({
          codigo: 'B001',
          localizacao: 'Rua Principal, 123',
          status: 'ativo',
          latitude: -23.5505,
          longitude: -46.6333,
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implementar chamada à API
      // if (isEditing) {
      //   await api.put(`/bueiros/${id}`, formData);
      // } else {
      //   await api.post('/bueiros', formData);
      // }
      // navigate('/bueiros');

      // Simulação de sucesso
      setTimeout(() => {
        navigate('/bueiros');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar bueiro:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Editar Bueiro' : 'Novo Bueiro'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            className="mt-1 input"
          />
        </div>

        <div>
          <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700">
            Localização
          </label>
          <input
            type="text"
            id="localizacao"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            required
            className="mt-1 input"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 input"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="manutencao">Em Manutenção</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
              className="mt-1 input"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
              className="mt-1 input"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/bueiros')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Salvar Alterações' : 'Criar Bueiro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBueiro; 