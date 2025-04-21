import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { usuario, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header usuario={usuario} onSignOut={signOut} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 