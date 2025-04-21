import React, { createContext, useContext, useState } from 'react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'tecnico' | 'operador';
  ativo: boolean;
}

interface AuthContextData {
  usuario: Usuario | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const isAuthenticated = !!usuario;

  const signIn = async (email: string, password: string) => {
    try {
      // Simulação de autenticação - será substituída pela chamada real à API
      const mockUsuario: Usuario = {
        id: 1,
        nome: 'Usuário Teste',
        email: email,
        tipo: 'admin',
        ativo: true
      };

      localStorage.setItem('@Bueiro:token', 'mock-token');
      localStorage.setItem('@Bueiro:user', JSON.stringify(mockUsuario));
      
      setUsuario(mockUsuario);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('@Bueiro:token');
    localStorage.removeItem('@Bueiro:user');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 