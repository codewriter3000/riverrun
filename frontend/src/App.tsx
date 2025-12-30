import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CasesPage } from './pages/CasesPage';
import { TasksPage } from './pages/TasksPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Router configuration
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'cases',
        element: <CasesPage />,
      },
      {
        path: 'cases/:id',
        element: <div>Case Detail Page (TODO)</div>,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'forms',
        element: (
          <ProtectedRoute requireRole="ADMIN">
            <div>Forms Page (TODO)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'workflows',
        element: (
          <ProtectedRoute requireRole="ADMIN">
            <div>Workflows Page (TODO)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            element: (
              <ProtectedRoute requireRole="ADMIN">
                <div>Users Admin Page (TODO)</div>
              </ProtectedRoute>
            ),
          },
          {
            path: 'audit',
            element: (
              <ProtectedRoute requireRole="ADMIN">
                <div>Audit Logs Page (TODO)</div>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}



export default App;
