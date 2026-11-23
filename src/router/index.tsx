import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SalesPage } from '@/pages/SalesPage';
import { StockPage } from '@/pages/StockPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { Spinner } from '@/components/ui/Spinner';

// 🔒 EMAILS AUTORIZADOS - Lista centralizada
const ALLOWED_EMAILS = [
  'jrocha.jaqueline@gmail.com',
  'luizgferreira13@gmail.com',
  'eberlejulio@gmail.com',
];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authService.getSession();
      
      // Verificar se está autenticado E se o email está permitido
      const isAuthenticated = !!session;
      const userEmail = session?.user?.email?.toLowerCase() || '';
      const isAllowed = ALLOWED_EMAILS.includes(userEmail);
      
      // Se estiver logado mas não for email permitido, desloga
      if (isAuthenticated && !isAllowed) {
        await authService.signOut();
        setAuthenticated(false);
      } else {
        setAuthenticated(isAuthenticated && isAllowed);
      }
      
      setLoading(false);
    };

    checkAuth();

    const subscription = authService.onAuthStateChange((user) => {
      const userEmail = user?.email?.toLowerCase() || '';
      const isAllowed = ALLOWED_EMAILS.includes(userEmail);
      setAuthenticated(!!user && isAllowed);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'stock', element: <StockPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
