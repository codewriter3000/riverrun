import { createMemoryRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();

// Layout component with navigation
function Layout() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Riverrun</h1>
        <p>Medium-Code Case Management Framework</p>
        <nav style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/cases')}>Cases</button>
          <button onClick={() => navigate('/tasks')}>Tasks</button>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

// Create memory router
const router = createMemoryRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'cases',
        element: <CasesPage />
      },
      {
        path: 'cases/:id',
        element: <CaseDetailPage />
      },
      {
        path: 'tasks',
        element: <TasksPage />
      }
    ]
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

function HomePage() {
  return (
    <div>
      <h2>Welcome to Riverrun</h2>
      <p>Your medium-code case management platform</p>
    </div>
  );
}

function CasesPage() {
  return (
    <div>
      <h2>Cases</h2>
      <p>Case list will appear here</p>
    </div>
  );
}

function CaseDetailPage() {
  return (
    <div>
      <h2>Case Details</h2>
      <p>Case detail view will appear here</p>
    </div>
  );
}

function TasksPage() {
  return (
    <div>
      <h2>Tasks</h2>
      <p>Task list will appear here</p>
    </div>
  );
}

export default App;
