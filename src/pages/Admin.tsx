import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

interface Model3D {
  id: number;
  name: string;
  price: number;
  image: string;
  tags: string[];
  category: string;
}

const mockModels: Model3D[] = [
  {
    id: 1,
    name: "Chrome Geometry",
    price: 12.99,
    image: "/img/81e5bc8d-ec10-404f-8104-00f0c12d0d27.jpg",
    tags: ["abstract", "chrome", "modern"],
    category: "Abstract"
  },
  {
    id: 2,
    name: "Future Robot",
    price: 24.99,
    image: "/img/cd9796df-cd02-4594-8bf6-88951bd41b72.jpg",
    tags: ["robot", "futuristic", "character"],
    category: "Characters"
  },
  {
    id: 3,
    name: "Crystal Sculpture",
    price: 18.50,
    image: "/img/98ad624f-ae7c-40d7-b4ab-fea2b133e361.jpg",
    tags: ["crystal", "glass", "elegant"],
    category: "Decorative"
  }
];

export default function Admin() {
  const { user, logout, getAllOrders, updateOrderStatus } = useAuth();
  const [models, setModels] = useState<Model3D[]>(mockModels);
  const [editingModel, setEditingModel] = useState<Model3D | null>(null);
  const [newModel, setNewModel] = useState<Partial<Model3D>>({
    name: '',
    price: 0,
    image: '',
    tags: [],
    category: 'Abstract',
    id: 0
  });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const orders = getAllOrders();

  const updateModel = (updatedModel: Model3D) => {
    setModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
    setEditingModel(null);
  };

  const deleteModel = (modelId: number) => {
    setModels(prev => prev.filter(m => m.id !== modelId));
  };

  const addNewModel = () => {
    if (newModel.name && newModel.price && newModel.image && newModel.category) {
      const model: Model3D = {
        ...newModel as Model3D,
        id: Date.now(),
        tags: typeof newModel.tags === 'string'
          ? (newModel.tags as string).split(',').map(t => t.trim()).filter(t => t.length > 0)
          : newModel.tags || []
      };
      setModels(prev => [...prev, model]);
      setNewModel({ name: '', price: 0, image: '', tags: [], category: 'Abstract', id: 0 });
    }
  };

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
      case 'pending': return 'Ожидает';
      case 'processing': return 'Обработка';
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
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Админ-панель
              </h1>
              <Badge className="bg-green-500/20 text-green-300 border-green-400/20">
                {user.name}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="glass border-white/20 hover:border-primary/50">
                  <Icon name="Home" size={16} className="mr-1" />
                  Каталог
                </Button>
              </Link>
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
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass border-white/20 mb-8">
            <TabsTrigger value="models" className="data-[state=active]:bg-primary/20">
              <Icon name="Box" size={16} className="mr-2" />
              Модели
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary/20">
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Заказы ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Управление моделями</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white border-0">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить модель
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Добавить новую модель</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Название</Label>
                        <Input
                          id="name"
                          value={newModel.name || ''}
                          onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                          className="glass border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-white">Цена ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newModel.price || ''}
                          onChange={(e) => setNewModel(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="glass border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image" className="text-white">URL изображения</Label>
                      <Input
                        id="image"
                        value={newModel.image || ''}
                        onChange={(e) => setNewModel(prev => ({ ...prev, image: e.target.value }))}
                        className="glass border-white/20 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-white">Категория</Label>
                        <Select
                          value={newModel.category || 'Abstract'}
                          onValueChange={(value) => setNewModel(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="glass border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            <SelectItem value="Abstract">Abstract</SelectItem>
                            <SelectItem value="Characters">Characters</SelectItem>
                            <SelectItem value="Decorative">Decorative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags" className="text-white">Теги (через запятую)</Label>
                        <Input
                          id="tags"
                          value={Array.isArray(newModel.tags) ? newModel.tags.join(', ') : newModel.tags || ''}
                          onChange={(e) => setNewModel(prev => ({ ...prev, tags: e.target.value }))}
                          className="glass border-white/20 text-white"
                          placeholder="например: modern, chrome, abstract"
                        />
                      </div>
                    </div>
                    <Button onClick={addNewModel} className="gradient-primary text-white border-0">
                      Добавить модель
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <Card key={model.id} className="glass-card p-0 overflow-hidden border-white/10">
                  <div className="relative">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="glass border-white/20 hover:border-yellow-500/50">
                            <Icon name="Edit" size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/20 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">Редактировать модель</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-name" className="text-white">Название</Label>
                                <Input
                                  id="edit-name"
                                  defaultValue={model.name}
                                  className="glass border-white/20 text-white"
                                  onChange={(e) => setEditingModel({ ...model, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-price" className="text-white">Цена ($)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  step="0.01"
                                  defaultValue={model.price}
                                  className="glass border-white/20 text-white"
                                  onChange={(e) => setEditingModel({ ...model, price: parseFloat(e.target.value) || 0 })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-image" className="text-white">URL изображения</Label>
                              <Input
                                id="edit-image"
                                defaultValue={model.image}
                                className="glass border-white/20 text-white"
                                onChange={(e) => setEditingModel({ ...model, image: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateModel(editingModel || model)}
                                className="gradient-primary text-white border-0 flex-1"
                              >
                                Сохранить
                              </Button>
                              <Button
                                onClick={() => deleteModel(model.id)}
                                variant="destructive"
                                className="border-0"
                              >
                                Удалить
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{model.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {model.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                        ${model.price}
                      </span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {model.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Управление заказами</h2>
            </div>

            <Card className="glass-card border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">№ Заказа</TableHead>
                    <TableHead className="text-white">Клиент</TableHead>
                    <TableHead className="text-white">Товары</TableHead>
                    <TableHead className="text-white">Сумма</TableHead>
                    <TableHead className="text-white">Статус</TableHead>
                    <TableHead className="text-white">Дата</TableHead>
                    <TableHead className="text-white">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-white/10">
                      <TableCell className="text-white font-mono">#{order.id}</TableCell>
                      <TableCell>
                        <div className="text-white">
                          <p className="font-semibold">{order.customerData.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customerData.email}</p>
                          <p className="text-sm text-muted-foreground">{order.customerData.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-white text-sm">
                              {item.name} - ${item.price}
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
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value: any) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32 glass border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            <SelectItem value="pending">Ожидает</SelectItem>
                            <SelectItem value="processing">Обработка</SelectItem>
                            <SelectItem value="shipped">Отправлен</SelectItem>
                            <SelectItem value="delivered">Доставлен</SelectItem>
                            <SelectItem value="cancelled">Отменен</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Заказов пока нет</h3>
                  <p className="text-muted-foreground">Новые заказы появятся здесь</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}