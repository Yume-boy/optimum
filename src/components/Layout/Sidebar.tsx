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
  // Warehouse, // Uncomment if you use this icon
  FileText,
  Shield,
  XCircle
  
} from 'lucide-react';
import { useSelector } from 'react-redux'; // Import useSelector // Adjust path to your Redux store type
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const [hide, setHide] = useState('')
      const router = useRouter()


    
      const goTo = (page:string) => {
        router.push(page)
      }



  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'superadmin', 'staff'], link: '/staff/dashboard' }, // Added 'superadmin'
    { id: 'orders', label: 'Orders', icon: Package, roles: ['admin', 'superadmin', 'staff'], permission: 'orders.view', link: '/staff/orders' },
    { id: 'drivers', label: 'Driver Management', icon: Truck, roles: ['admin', 'superadmin', 'staff'], permission: 'drivers.view', link: '/staff/driverManagement' },
    { id: 'customers', label: 'Customer Management', icon: Users, roles: ['admin', 'superadmin', 'staff'], permission: 'customers.view', link: '/staff/customerManagement' },
    // { id: 'warehouses', label: 'Warehouses', icon: Warehouse, roles: ['admin', 'superadmin'] },
    { id: 'tracking', label: 'Live Tracking', icon: MapPin, roles: ['admin', 'superadmin', 'customer', 'driver', 'staff'], link: '/staff/tracking' }, // Admins can track all
    // { id: 'payments', label: 'Payments', icon: CreditCard, roles: ['admin', 'superadmin'], link: '/staff/payments' },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'superadmin', 'staff'], permission: 'reports.view', link: '/staff/reports' },
    // { id: 'audit', label: 'Audit Log', icon: Shield, roles: ['admin', 'superadmin'], permission: 'system.audit', link: '/staff/auditLog' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'superadmin', 'driver', 'customer', 'staff'], link: '/staff/settings' },
    { id: 'superadmin', label: 'Superadmin', icon: Settings, roles: ['superadmin'], link: '/staff/superadmin' },
  ];

  const driverMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['driver'], link: '/driver/dashboard' },
    // { id: 'jobs', label: 'Available Jobs', icon: Package, roles: ['driver'] },
    { id: 'active-delivery', label: 'Deliveries', icon: Truck, roles: ['driver'], link: '/driver/deliveries' },
    { id: 'route', label: 'Route Map', icon: MapPin, roles: ['driver'], link: '/driver/routeMap' },
    // { id: 'earnings', label: 'Earnings', icon: CreditCard, roles: ['driver'] },
    { id: 'history', label: 'Trip History', icon: FileText, roles: ['driver'], link: '/driver/history' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['driver'], link: '/driver/settings' },
  ];

  const customerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['customer'], link: '/customer/dashboard' },
    { id: 'book-order', label: 'Book Order', icon: Package, roles: ['customer'], link: '/customer/bookOrder' },
    { id: 'my-orders', label: 'My Orders', icon: FileText, roles: ['customer'], link: '/customer/orders' },
    { id: 'tracking', label: 'Track Order', icon: MapPin, roles: ['customer'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: ['customer'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['customer'], link: '/customer/settings'  },
  ];

    const email = sessionStorage.getItem('email')
    const role = sessionStorage.getItem('role')

  const getMenuItems = () => {
    const userRole = role; // Get role from activeUser
    if (!userRole) return []; // No user, no menu items

    let itemsToFilter: typeof adminMenuItems = []; 

    if (userRole === 'customer') {
      itemsToFilter = customerMenuItems;
    } else if (userRole === 'driver') {
      itemsToFilter = driverMenuItems;
    } else { 
      // For any other role (e.g., 'admin', 'superadmin'), show the admin menu.
      // The filtering below will ensure only items explicitly listing this role are shown.
      itemsToFilter = adminMenuItems;
    }

    // Filter items based on the 'roles' array directly.
    // This ensures that even if `itemsToFilter` is `adminMenuItems`,
    // only items that include the specific `userRole` (like 'superadmin') will be displayed.
    return itemsToFilter.filter(item => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();

  return (
    <div className={clsx(
      `bg-[#541D9C] text-white transition-all duration-300 flex flex-col w-64 fixed left-0 top-0 h-screen z-50`,
    )}>
      <div className="p-4 border-b border-slate-700">
        <div className=" items-center space-x-3 flex justify-between">
            <span className="font-bold text-lg">Optimum</span>
            <XCircle className='text-white' onClick={toggleSidebar}/>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                onClick={()=> goTo(item.link)}
                  className={clsx(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    // activeTab === item.id
                    //   ? "bg-[#491DF1] text-white"
                    //   : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
              {/* Display active user's email or name from Redux state */}
              <p className="text-sm font-medium text-white truncate">
                {email || 'Guest'}
              </p>
              <p className="text-xs text-slate-400 capitalize">
                {role || 'N/A'}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
