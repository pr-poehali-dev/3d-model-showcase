import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: ''
  });
  
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(userFormData.email, userFormData.password, 'user');
    
    if (success) {
      navigate('/profile');
    } else {
      setError('Неверный email или пароль');
    }
    
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(adminFormData.email, adminFormData.password, 'admin');
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Неверные данные администратора');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-float"></div>
        <div className="absolute top-60 right-1/4 w-48 h-48 rounded-full bg-secondary/15 blur-3xl animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-24 h-24 rounded-full bg-accent/25 blur-3xl animate-float delay-2000"></div>
      </div>

      <Card className="glass-card p-8 w-full max-w-md border-white/20">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Icon name="Box" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            3D Store
          </h1>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass border-white/20">
            <TabsTrigger value="user" className="data-[state=active]:bg-primary/20">
              Пользователь
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-primary/20">
              Администратор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div>
                <Label htmlFor="user-email" className="text-white">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="glass border-white/20 text-white"
                  placeholder="user@store.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="user-password" className="text-white">Пароль</Label>
                <Input
                  id="user-password"
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="glass border-white/20 text-white"
                  placeholder="user123"
                  required
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button 
                type="submit" 
                className="w-full gradient-primary text-white border-0"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-white">Email администратора</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="glass border-white/20 text-white"
                  placeholder="admin@store.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password" className="text-white">Пароль</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="glass border-white/20 text-white"
                  placeholder="admin123"
                  required
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button 
                type="submit" 
                className="w-full gradient-primary text-white border-0"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти в админ-панель'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            ← Вернуться на главную
          </Link>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 glass border border-white/10 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-2">Демо доступы:</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Пользователь:</strong> user@store.com / user123</p>
            <p><strong>Админ:</strong> admin@store.com / admin123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}