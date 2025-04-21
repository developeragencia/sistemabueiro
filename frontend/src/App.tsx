import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Bueiros from './pages/Bueiros/Bueiros';
import DetalhesBueiro from './pages/Bueiros/DetalhesBueiro';
import FormBueiro from './pages/Bueiros/FormBueiro';
import Alertas from './pages/Alertas/Alertas';
import Relatorios from './pages/Relatorios/Relatorios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bueiros" element={<Bueiros />} />
            <Route path="bueiros/:id" element={<DetalhesBueiro />} />
            <Route path="bueiros/novo" element={<FormBueiro />} />
            <Route path="bueiros/editar/:id" element={<FormBueiro />} />
            <Route path="alertas" element={<Alertas />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 