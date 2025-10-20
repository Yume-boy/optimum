'use client'
import React, {useState} from 'react';
import { 
  Home, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  XCircle,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  toggleSidebar: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: string[];
  link?: string;
  permission?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const [hide, setHide] = useState('');
  const router = useRouter();
    
  const goTo = (page: string) => {
    router.push(page);
  };

  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'superadmin', 'staff'], link: '/staff/dashboard' },
    { id: 'orders', label: 'Orders', icon: Package, roles: ['admin', 'superadmin', 'staff'], link: '/staff/orders' },
    { id: 'drivers', label: 'Driver Management', icon: Truck, roles: ['admin', 'superadmin', 'staff'], link: '/staff/driverManagement' },
    { id: 'customers', label: 'Customer Management', icon: Users, roles: ['admin', 'superadmin', 'staff'], link: '/staff/customerManagement' },
    { id: 'tracking', label: 'Live Tracking', icon: MapPin, roles: ['admin', 'superadmin', 'customer', 'driver', 'staff'], link: '/staff/tracking' },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'superadmin', 'staff'], link: '/staff/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'superadmin', 'driver', 'customer', 'staff'], link: '/staff/settings' },
    { id: 'superadmin', label: 'Superadmin', icon: Settings, roles: ['superadmin'], link: '/staff/superadmin' },
  ];

  const driverMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['driver'], link: '/driver/dashboard' },
    { id: 'active-delivery', label: 'Deliveries', icon: Truck, roles: ['driver'], link: '/driver/deliveries' },
    { id: 'route', label: 'Route Map', icon: MapPin, roles: ['driver'], link: '/driver/routeMap' },
    { id: 'history', label: 'Trip History', icon: FileText, roles: ['driver'], link: '/driver/history' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['driver'], link: '/driver/settings' },
  ];

  const customerMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['customer'], link: '/customer/dashboard' },
    { id: 'book-order', label: 'Book Order', icon: Package, roles: ['customer'], link: '/customer/bookOrder' },
    { id: 'my-orders', label: 'My Orders', icon: FileText, roles: ['customer'], link: '/customer/orders' },
    { id: 'tracking', label: 'Track Order', icon: MapPin, roles: ['customer'], link: '/customer/tracking' },
    // { id: 'payments', label: 'Payments', icon: CreditCard, roles: ['customer'], link: '/customer/payments' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['customer'], link: '/customer/settings' },
  ];

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('email') : null;
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('role') : null;

  const getMenuItems = (): MenuItem[] => {
    const userRole = role;
    if (!userRole) return [];

    let itemsToFilter: MenuItem[] = [];

    if (userRole === 'customer') {
      itemsToFilter = customerMenuItems;
    } else if (userRole === 'driver') {
      itemsToFilter = driverMenuItems;
    } else { 
      itemsToFilter = adminMenuItems;
    }

    return itemsToFilter.filter((item) => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={clsx(
        'bg-[#541D9C] text-white transition-all duration-300 flex flex-col w-64 fixed left-0 top-0 h-screen z-50'
      )}
    >
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between space-x-3">
            <span className="font-bold text-lg">Optimum</span>
          <XCircle className="text-white cursor-pointer" onClick={toggleSidebar} />
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => goTo(item.link || '#')}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors'
                  )}
                >
                  <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
            <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{email || 'Guest'}</p>
            <p className="text-xs text-slate-400 capitalize">{role || 'N/A'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
