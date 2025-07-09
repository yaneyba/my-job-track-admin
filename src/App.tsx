import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { LoginForm } from '@/components/Auth/LoginForm';
import { Dashboard } from '@/pages/Dashboard';
import { Customers } from '@/pages/Customers';
import { Jobs } from '@/pages/Jobs';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { apiClient } from '@/lib/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const isAuth = apiClient.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiClient.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
