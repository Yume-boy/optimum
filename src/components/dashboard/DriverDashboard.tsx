import React from 'react';
import {
  Package,
  DollarSign,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const DriverDashboard: React.FC = () => {
  // Dummy driver stats
  const driverStats = [
    {
      title: "Today's Earnings",
      value: '$125.50',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: 'Deliveries Today',
      value: '8',
      change: '+2',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Rating',
      value: '4.8',
      change: '+0.1',
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      title: 'Distance Covered',
      value: '45 km',
      change: '+8 km',
      icon: MapPin,
      color: 'bg-purple-500',
    },
  ];

  // Dummy orders data
  const orders = [
    {
      id: '101',
      driverId: '1',
      pickupAddress: 'Warehouse A, Lagos',
      deliveryAddress: 'Customer B, Ikeja',
      category: 'Electronics',
      totalAmount: 45.5,
      status: 'delivered',
    },
    {
      id: '102',
      driverId: '1',
      pickupAddress: 'Cold Storage, VI',
      deliveryAddress: 'Restaurant C, Lekki',
      category: 'Groceries',
      totalAmount: 32.75,
      status: 'in_transit',
    },
    {
      id: '103',
      driverId: '1',
      pickupAddress: 'Office D, Surulere',
      deliveryAddress: 'Shop E, Yaba',
      category: 'Documents',
      totalAmount: 20.0,
      status: 'pending',
    },
    {
      id: '104',
      driverId: '2',
      pickupAddress: 'Warehouse Z, Abuja',
      deliveryAddress: 'Mall F, Wuse',
      category: 'Furniture',
      totalAmount: 150.0,
      status: 'delivered',
    },
  ];

  const todayOrders = orders.filter((order) => order.driverId === '1').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-medium text-emerald-600">Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {driverStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-emerald-600">
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from yesterday</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Orders</h3>
          <div className="space-y-4">
            {todayOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>From: {order.pickupAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>To: {order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-medium">{order.category}</span>
                    <span className="font-medium text-gray-900">
                      ${order.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700">
                    View Route
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Contact Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-emerald-700">Mark Delivered</span>
            </button>
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-700">Update Location</span>
            </button>
            <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-yellow-700">Report Issue</span>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-700">Break Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">
                  {Math.floor(Math.random() * 10) + 1}
                </div>
                <div className="text-xs text-gray-500">deliveries</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
