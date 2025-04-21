import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Bueiros from './pages/Bueiros/Bueiros';
import DetalhesBueiro from './pages/Bueiros/DetalhesBueiro';
import FormBueiro from './pages/Bueiros/FormBueiro';
import Alertas from './pages/Alertas/Alertas';
import Relatorios from './pages/Relatorios/Relatorios';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/bueiros',
        element: <Bueiros />,
      },
      {
        path: '/bueiros/:id',
        element: <DetalhesBueiro />,
      },
      {
        path: '/bueiros/novo',
        element: <FormBueiro />,
      },
      {
        path: '/bueiros/:id/editar',
        element: <FormBueiro />,
      },
      {
        path: '/alertas',
        element: <Alertas />,
      },
      {
        path: '/relatorios',
        element: <Relatorios />,
      },
    ],
  },
]); 