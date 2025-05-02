import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, loadUser, userInitialized } = useAuth();

  useEffect(() => {
    async function load() {
      if (!isAuthenticated && !loading && !userInitialized) {
        await loadUser();
      }
    }
    load();
  }, [isAuthenticated, loading, userInitialized]);

  if (loading || !userInitialized) return <Loader color='green' />;
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
}
