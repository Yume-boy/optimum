'use client';

import React from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { useFetchResourceQuery } from '@/redux/api/crudApi';
import { useRouter } from 'next/navigation';

const CustomerDashboard: React.FC = () => {
  const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError } =
    useFetchResourceQuery('/dashboard');
  const router = useRouter();

  // Dashboard statistics (dummy/fallback data)
  const stats = [
    {
      title: 'Total Orders',
      value: dashboardData?.totalOrders ?? 10,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'In Transit',
      value: dashboardData?.inTransit ?? 20,
      icon: Truck,
      color: 'bg-orange-500',
    },
    {
      title: 'Delivered',
      value: dashboardData?.delivered ?? 30,
      icon: CheckCircle,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Spent',
      value: `₦${dashboardData?.totalSpent ?? 150}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  // Dummy recent orders
  const recentOrders = [
    {
      id: 'ORD-1001',
      status: 'delivered',
      pickup_address: '12 Adebayo Street, Ikeja, Lagos',
      delivery_address: '22 Awolowo Road, Ikoyi, Lagos',
      category: 'Electronics',
      weight: '2.5kg',
      price: 7500,
    },
    {
      id: 'ORD-1002',
      status: 'in_transit',
      pickup_address: '15 Herbert Macaulay Way, Yaba, Lagos',
      delivery_address: '5 Unity Close, Lekki Phase 1, Lagos',
      category: 'Groceries',
      weight: '10kg',
      price: 3200,
    },
    {
      id: 'ORD-1003',
      status: 'processing',
      pickup_address: '8 Olusegun Obasanjo Road, Abuja',
      delivery_address: '14 Garki Crescent, Abuja',
      category: 'Clothing',
      weight: '4kg',
      price: 4500,
    },
  ];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        <p className="ml-4 text-gray-600">Loading your dashboard data...</p>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded-lg">
        <p>Error loading dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <button
          onClick={() => router.push('/customer/bookOrder')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Book New Order
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Orders
        </h3>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Order #{order.id}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : ['in_transit', 'processing', 'picked_up'].includes(
                            order.status
                          )
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>From: {order.pickup_address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>To: {order.delivery_address}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>
                        {order.category} - {order.weight}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-gray-900">
                        ₦ {order.price ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700">
                    Track Order
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recent orders found.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Book Delivery */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-lg text-white">
          <Package className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Book a Delivery</h3>
          <p className="text-emerald-100 mb-4">
            Send your package anywhere in the city
          </p>
          <button
            onClick={() => router.push('/customer/bookOrder')}
            className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50"
          >
            Book Now
          </button>
        </div>

        {/* Track Package */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <MapPin className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Track Package</h3>
          <p className="text-blue-100 mb-4">
            Monitor your delivery in real-time
          </p>
          <button
            onClick={() => router.push('/customer/tracking')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            Track Now
          </button>
        </div>

        {/* Schedule Delivery */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <Clock className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Schedule Delivery</h3>
          <p className="text-purple-100 mb-4">
            Plan your delivery for later
          </p>
          <button
            onClick={() => router.push('/customer/bookOrder')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
