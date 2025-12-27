import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import AuthPage from './components/AuthPage';

const queryClient = new QueryClient();

// Layout component with navigation
function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Riverrun</h1>
        <p>Medium-Code Case Management Framework</p>
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
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}



export default App;
