import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, logout, getUserOrders } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const orders = getUserOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/20';
      case 'processing': return 'bg-blue-500/20 text-blue-300 border-blue-400/20';
      case 'shipped': return 'bg-purple-500/20 text-purple-300 border-purple-400/20';
      case 'delivered': return 'bg-green-500/20 text-green-300 border-green-400/20';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-400/20';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает обработки';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-float"></div>
        <div className="absolute top-60 right-1/4 w-48 h-48 rounded-full bg-secondary/15 blur-3xl animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-24 h-24 rounded-full bg-accent/25 blur-3xl animate-float delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="User" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Личный кабинет
              </h1>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {user.name}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="glass border-white/20 hover:border-primary/50">
                <Icon name="Home" size={16} className="mr-1" />
                Главная
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass border-white/20 hover:border-red-500/50"
                onClick={logout}
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* User Info */}
        <Card className="glass-card p-6 mb-8 border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <Icon name="User" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                Пользователь
              </Badge>
            </div>
          </div>
        </Card>

        {/* Orders */}
        <Card className="glass-card border-white/20">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Icon name="ShoppingBag" size={24} className="text-primary" />
              <h3 className="text-2xl font-bold text-white">Мои заказы</h3>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {orders.length}
              </Badge>
            </div>
          </div>

          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">№ Заказа</TableHead>
                  <TableHead className="text-white">Товары</TableHead>
                  <TableHead className="text-white">Сумма</TableHead>
                  <TableHead className="text-white">Статус</TableHead>
                  <TableHead className="text-white">Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-white/10">
                    <TableCell className="text-white font-mono">#{order.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="text-white text-sm">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-muted-foreground">${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-bold">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-white">У вас пока нет заказов</h3>
              <p className="text-muted-foreground mb-6">
                Перейдите в каталог и выберите понравившиеся модели
              </p>
              <Button className="gradient-primary text-white border-0">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Перейти в каталог
              </Button>
            </div>
          )}
        </Card>

        {/* Order Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="glass-card p-4 border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Icon name="Clock" size={16} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ожидают</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-4 border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Icon name="Package" size={16} className="text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">В обработке</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === 'processing').length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-4 border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Icon name="Truck" size={16} className="text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Отправлен</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === 'shipped').length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-4 border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Доставлен</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}