import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

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
  },
  {
    id: 4,
    name: "Minimal Cube",
    price: 8.99,
    image: "/img/81e5bc8d-ec10-404f-8104-00f0c12d0d27.jpg",
    tags: ["minimal", "geometric", "basic"],
    category: "Abstract"
  },
  {
    id: 5,
    name: "Space Marine",
    price: 32.99,
    image: "/img/cd9796df-cd02-4594-8bf6-88951bd41b72.jpg",
    tags: ["character", "armor", "sci-fi"],
    category: "Characters"
  },
  {
    id: 6,
    name: "Glass Vase",
    price: 15.99,
    image: "/img/98ad624f-ae7c-40d7-b4ab-fea2b133e361.jpg",
    tags: ["vase", "transparent", "home"],
    category: "Decorative"
  }
];

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Model3D[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [models, setModels] = useState<Model3D[]>(mockModels);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingModel, setEditingModel] = useState<Model3D | null>(null);
  const [viewingModel, setViewingModel] = useState<Model3D | null>(null);
  const [newModel, setNewModel] = useState<Partial<Model3D>>({ 
    name: '', 
    price: 0, 
    image: '', 
    tags: [], 
    category: 'Abstract', 
    id: 0 
  });

  const categories = ['Все', 'Abstract', 'Characters', 'Decorative'];

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Все' || model.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, models]);

  const addToCart = (model: Model3D) => {
    setCart(prev => [...prev, model]);
  };

  const removeFromCart = (modelId: number) => {
    setCart(prev => prev.filter(item => item.id !== modelId));
  };

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

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cart.length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
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
                <Icon name="Box" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                3D Store
              </h1>
              {isAdminMode && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/20">
                  Админ режим
                </Badge>
              )}
            </div>

            <nav className="flex items-center gap-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Поиск моделей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 glass border-white/20 focus:border-primary/50 placeholder:text-muted-foreground/60"
                />
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="glass border-white/20 hover:border-primary/50 relative"
                onClick={() => console.log('Открыть корзину')}
              >
                <Icon name="ShoppingCart" size={16} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className={`glass border-white/20 hover:border-primary/50 ${isAdminMode ? 'bg-primary/20 border-primary/50' : ''}`}
                onClick={() => setIsAdminMode(!isAdminMode)}
              >
                <Icon name={isAdminMode ? "Shield" : "User"} size={16} />
              </Button>

              {isAdminMode && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gradient-primary text-white border-0">
                      <Icon name="Plus" size={16} className="mr-1" />
                      Добавить
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
                            onChange={(e) => setNewModel(prev => ({...prev, name: e.target.value}))}
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
                            onChange={(e) => setNewModel(prev => ({...prev, price: parseFloat(e.target.value) || 0}))}
                            className="glass border-white/20 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="image" className="text-white">URL изображения</Label>
                        <Input
                          id="image"
                          value={newModel.image || ''}
                          onChange={(e) => setNewModel(prev => ({...prev, image: e.target.value}))}
                          className="glass border-white/20 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category" className="text-white">Категория</Label>
                          <Select
                            value={newModel.category || 'Abstract'}
                            onValueChange={(value) => setNewModel(prev => ({...prev, category: value}))}
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
                            onChange={(e) => setNewModel(prev => ({...prev, tags: e.target.value}))}
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
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
              Премиум 3D Модели
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Откройте мир высококачественных 3D-моделей для ваших проектов. 
              От абстрактных форм до реалистичных персонажей.
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "gradient-primary text-white border-0 shadow-lg" 
                    : "glass border-white/20 hover:border-primary/50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model, index) => (
              <Card 
                key={model.id} 
                className="glass-card hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl p-0 overflow-hidden group animate-scale-in border-white/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                    {/* View Model Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="glass border-white/20 hover:border-primary/50">
                          <Icon name="Eye" size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-white/20 max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-white text-2xl">{model.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img 
                              src={model.image} 
                              alt={model.name}
                              className="w-full h-80 object-cover rounded-lg"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">Описание</h3>
                              <p className="text-muted-foreground">
                                Высококачественная 3D модель {model.name} в категории {model.category}. 
                                Идеально подходит для профессиональных проектов.
                              </p>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">Теги</h3>
                              <div className="flex flex-wrap gap-2">
                                {model.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="bg-white/10 text-white/80 border-white/20">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">Категория</h3>
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                {model.category}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                                ${model.price}
                              </span>
                            </div>
                            <Button
                              onClick={() => addToCart(model)}
                              className="w-full gradient-primary text-white border-0 hover:shadow-lg hover:shadow-primary/25"
                            >
                              <Icon name="ShoppingCart" size={16} className="mr-2" />
                              Добавить в корзину
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Admin Edit Button */}
                    {isAdminMode && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="glass border-white/20 hover:border-yellow-500/50 bg-yellow-500/20">
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
                                  onChange={(e) => setEditingModel({...model, name: e.target.value})}
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
                                  onChange={(e) => setEditingModel({...model, price: parseFloat(e.target.value) || 0})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-image" className="text-white">URL изображения</Label>
                              <Input
                                id="edit-image"
                                defaultValue={model.image}
                                className="glass border-white/20 text-white"
                                onChange={(e) => setEditingModel({...model, image: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-category" className="text-white">Категория</Label>
                                <Select
                                  defaultValue={model.category}
                                  onValueChange={(value) => setEditingModel({...model, category: value})}
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
                                <Label htmlFor="edit-tags" className="text-white">Теги (через запятую)</Label>
                                <Input
                                  id="edit-tags"
                                  defaultValue={model.tags.join(', ')}
                                  className="glass border-white/20 text-white"
                                  onChange={(e) => setEditingModel({...model, tags: e.target.value.split(',').map(t => t.trim())})}
                                />
                              </div>
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
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {model.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors">
                    {model.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                      ${model.price}
                    </span>
                    
                    <Button
                      onClick={() => addToCart(model)}
                      size="sm"
                      className="gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 border-0"
                    >
                      <Icon name="Plus" size={14} className="mr-1" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-20">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Summary (if not empty) */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Card className="glass-card p-4 animate-scale-in border-white/20">
            <div className="flex items-center gap-3">
              <Icon name="ShoppingBag" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium">{cartCount} товаров</p>
                <p className="text-lg font-bold text-primary">${cartTotal.toFixed(2)}</p>
              </div>
              <Button size="sm" className="gradient-primary text-white border-0 ml-2">
                Оформить
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="glass-card border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon name="Box" size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold">3D Store</h3>
              </div>
              <p className="text-muted-foreground">
                Премиум 3D модели для профессиональных проектов
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Категории</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Персонажи</li>
                <li>Архитектура</li>
                <li>Декор</li>
                <li>Абстрактные формы</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Помощь</li>
                <li>Контакты</li>
                <li>Лицензии</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 3D Store. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}