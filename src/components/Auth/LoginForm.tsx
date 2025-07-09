import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardContent } from '@/components/UI/Card';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LoginFormProps {
  onSuccess: (user: any) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await apiClient.login(email, password);
      
      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Job Track Admin
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<UserIcon className="h-5 w-5" />}
                  variant="filled"
                />
                
                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<LockClosedIcon className="h-5 w-5" />}
                  variant="filled"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200 animate-in slide-in-from-top-1">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-blue-600">
                Email: analytics@test.com<br />
                Password: analytics123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Secure admin access for job tracking management</p>
        </div>
      </div>
    </div>
  );
}