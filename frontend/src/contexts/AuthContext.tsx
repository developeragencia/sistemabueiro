import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import api from '../services/api';

interface AuthContextData {
  usuario: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      // TODO: Implementar chamada à API para buscar dados do usuário
      // const fetchUsuario = async () => {
      //   try {
      //     const response = await api.get('/usuarios/me');
      //     setUsuario(response.data);
      //   } catch (error) {
      //     localStorage.removeItem('token');
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchUsuario();

      // Dados mockados para demonstração
      setTimeout(() => {
        setUsuario({
          id: 1,
          nome: 'Administrador',
          email: 'admin@bueiro2029.com',
          tipo: 'admin',
          ativo: true,
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Implementar chamada à API
      // const response = await api.post('/auth/login', { email, password });
      // const { token, usuario } = response.data;
      // localStorage.setItem('token', token);
      // api.defaults.headers.Authorization = `Bearer ${token}`;
      // setUsuario(usuario);

      // Simulação de sucesso
      const mockUsuario = {
        id: 1,
        nome: 'Administrador',
        email: 'admin@bueiro2029.com',
        tipo: 'admin',
        ativo: true,
      };
      localStorage.setItem('token', 'mock-token');
      api.defaults.headers.Authorization = 'Bearer mock-token';
      setUsuario(mockUsuario);
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 