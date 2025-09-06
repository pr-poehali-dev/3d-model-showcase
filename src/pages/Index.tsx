import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  const { user, createOrder } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Model3D[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [viewingModel, setViewingModel] = useState<Model3D | null>(null);
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Update customer data when user changes
  React.useEffect(() => {
    if (user) {
      setCustomerData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const categories = ['Все', 'Abstract', 'Characters', 'Decorative'];

  const filteredModels = useMemo(() => {
    return mockModels.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Все' || model.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const addToCart = (model: Model3D) => {
    setCart(prev => [...prev, model]);
  };

  const removeFromCart = (modelId: number) => {
    setCart(prev => prev.filter((item, index) => 
      index !== prev.findIndex(cartItem => cartItem.id === modelId)
    ));
  };

  const handleCheckout = () => {
    if (!user) {
      return;
    }
    
    if (customerData.name && customerData.email && customerData.phone && customerData.address) {
      createOrder(cart, customerData);
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      alert('Заказ успешно оформлен! Вы можете отслеживать его в личном кабинете.');
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  const handleCartCheckout = () => {
    if (!user) {
      alert('Необходимо войти в аккаунт для оформления заказа');
      return;
    }
    setShowCheckout(true);
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

              <Dialog open={showCart} onOpenChange={setShowCart}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="glass border-white/20 hover:border-primary/50 relative"
                  >
                    <Icon name="ShoppingCart" size={16} />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Корзина ({cartCount})</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto">
                    {cart.length > 0 ? (
                      <div className="space-y-4">
                        {cart.map((item, index) => (
                          <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-3 glass rounded-lg border-white/10">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{item.name}</h4>
                              <p className="text-muted-foreground">${item.price}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="glass border-white/20 hover:border-red-500/50 text-red-400"
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-4">
                          <div className="flex justify-between items-center text-white text-lg font-bold mb-4">
                            <span>Итого: ${cartTotal.toFixed(2)}</span>
                          </div>
                          <Button
                            onClick={handleCartCheckout}
                            className="w-full gradient-primary text-white border-0"
                          >
                            {user ? 'Оформить заказ' : 'Войдите для заказа'}
                          </Button>
                          {!user && (
                            <p className="text-sm text-muted-foreground text-center mt-2">
                              <Link to="/login" className="text-primary hover:underline">Войти</Link> или{' '}
                              <Link to="/register" className="text-primary hover:underline">зарегистрироваться</Link>
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Корзина пуста</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {user ? (
                <Link to={user.role === 'admin' ? '/admin' : '/profile'}>
                  <Button variant="outline" size="sm" className="glass border-white/20 hover:border-primary/50">
                    <Icon name={user.role === 'admin' ? 'Shield' : 'User'} size={16} />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="glass border-white/20 hover:border-primary/50">
                    <Icon name="User" size={16} />
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="glass border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Оформление заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer-name" className="text-white">Имя</Label>
              <Input
                id="customer-name"
                value={customerData.name}
                onChange={(e) => setCustomerData(prev => ({...prev, name: e.target.value}))}
                className="glass border-white/20 text-white"
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <Label htmlFor="customer-email" className="text-white">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
                className="glass border-white/20 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="customer-phone" className="text-white">Телефон</Label>
              <Input
                id="customer-phone"
                value={customerData.phone}
                onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
                className="glass border-white/20 text-white"
                placeholder="+7 999 123 45 67"
              />
            </div>
            <div>
              <Label htmlFor="customer-address" className="text-white">Адрес доставки</Label>
              <Input
                id="customer-address"
                value={customerData.address}
                onChange={(e) => setCustomerData(prev => ({...prev, address: e.target.value}))}
                className="glass border-white/20 text-white"
                placeholder="Город, улица, дом"
              />
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="text-white text-lg font-bold mb-4">
                Итого: ${cartTotal.toFixed(2)}
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full gradient-primary text-white border-0"
              >
                Подтвердить заказ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
              <Button 
                size="sm" 
                className="gradient-primary text-white border-0 ml-2"
                onClick={() => setShowCart(true)}
              >
                Открыть
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