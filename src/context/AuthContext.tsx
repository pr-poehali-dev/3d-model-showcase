import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface Order {
  id: number;
  userId: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string, role?: 'user' | 'admin') => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  createOrder: (items: any[], customerData: any) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
  getUserOrders: () => Order[];
  getAllOrders: () => Order[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock данные для демонстрации
const mockUsers = [
  { id: 1, email: 'admin@store.com', password: 'admin123', name: 'Администратор', role: 'admin' as const },
  { id: 2, email: 'user@store.com', password: 'user123', name: 'Пользователь', role: 'user' as const }
];

const mockOrders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      { id: 1, name: 'Chrome Geometry', price: 12.99, image: '/img/81e5bc8d-ec10-404f-8104-00f0c12d0d27.jpg' }
    ],
    total: 12.99,
    status: 'processing',
    customerData: {
      name: 'Иван Петров',
      email: 'user@store.com',
      phone: '+7 999 123 45 67',
      address: 'Москва, ул. Примерная, д. 1'
    },
    createdAt: '2024-12-01T10:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    // Проверяем сохраненную сессию
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Загружаем заказы из localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const login = async (email: string, password: string, role?: 'user' | 'admin') => {
    // Поиск пользователя в mock данных
    const foundUser = mockUsers.find(u => 
      u.email === email && 
      u.password === password && 
      (role ? u.role === role : true)
    );

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string) => {
    // Проверяем, что пользователь не существует
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      role: 'user' as const
    };

    mockUsers.push(newUser);
    
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
    
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const createOrder = (items: any[], customerData: any) => {
    if (!user) return;

    const newOrder: Order = {
      id: Date.now(),
      userId: user.id,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      })),
      total: items.reduce((sum, item) => sum + item.price, 0),
      status: 'pending',
      customerData,
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = (orderId: number, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <AuthContext.Provider value={{
      user,
      orders,
      login,
      register,
      logout,
      createOrder,
      updateOrderStatus,
      getUserOrders,
      getAllOrders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}