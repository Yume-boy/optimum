import React, { useState } from 'react';
import { User, Package, MapPin, DollarSign, Clock, Search, Filter, Eye, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const CustomerManagement: React.FC = () => {
  const { orders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Mock customer data - in real app this would come from API
  const customers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: new Date('2024-01-15'),
      totalOrders: 12,
      totalSpent: 450.75,
      status: 'active',
      lastOrderDate: new Date('2024-12-15'),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      joinDate: new Date('2024-02-20'),
      totalOrders: 8,
      totalSpent: 320.50,
      status: 'active',
      lastOrderDate: new Date('2024-12-10'),
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 (555) 345-6789',
      joinDate: new Date('2024-03-10'),
      totalOrders: 15,
      totalSpent: 675.25,
      status: 'inactive',
      lastOrderDate: new Date('2024-11-20'),
    },
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getCurrentDelivery = (customerId: string) => {
    return orders.find(order => order.customerId === customerId && 
                      (order.status === 'in_transit' || order.status === 'assigned'));
  };

  const getOutstandingOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId && 
                        order.status !== 'delivered' && order.status !== 'cancelled');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const selectedCustomerData = selectedCustomer ? customers.find(c => c.id === selectedCustomer) : null;
  const selectedCustomerOrders = selectedCustomer ? getCustomerOrders(selectedCustomer) : [];
  const currentDelivery = selectedCustomer ? getCurrentDelivery(selectedCustomer) : null;
  const outstandingOrders = selectedCustomer ? getOutstandingOrders(selectedCustomer) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {customers.filter(c => c.status === 'active').length} active • {customers.filter(c => c.status === 'inactive').length} inactive
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-emerald-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredCustomers.length} customers found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Customers</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const customerOrders = getCustomerOrders(customer.id);
                const currentOrder = getCurrentDelivery(customer.id);
                const outstanding = getOutstandingOrders(customer.id);
                
                return (
                  <div 
                    key={customer.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedCustomer === customer.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{customer.name}</h4>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                              {customer.status}
                            </span>
                            <span className="text-xs text-gray-600">
                              Joined {customer.joinDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{customer.totalOrders} orders</p>
                        <p className="text-sm text-gray-600">${customer.totalSpent}</p>
                        {outstanding.length > 0 && (
                          <p className="text-xs text-orange-600 mt-1">{outstanding.length} pending</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-6">
          {selectedCustomerData ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedCustomerData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedCustomerData.email}</p>
                      <p className="text-sm text-gray-600">{selectedCustomerData.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Total Orders</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900">{selectedCustomerData.totalOrders}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Total Spent</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900">${selectedCustomerData.totalSpent}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-900">Member Since</span>
                      </div>
                      <p className="text-sm font-bold text-emerald-900">
                        {selectedCustomerData.joinDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">Last Order</span>
                      </div>
                      <p className="text-sm font-bold text-orange-900">
                        {selectedCustomerData.lastOrderDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Call
                    </button>
                  </div>
                </div>
              </div>

              {/* Current/Outstanding Deliveries */}
              {outstandingOrders.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Orders</h3>
                  <div className="space-y-3">
                    {outstandingOrders.map((order) => (
                      <div key={order.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Category:</span> {order.category}</p>
                          <p><span className="font-medium">Amount:</span> ${order.totalAmount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {selectedCustomerOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                        <p className="text-xs text-gray-600">{order.category} • {order.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${order.totalAmount}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedCustomerOrders.length > 5 && (
                  <button className="w-full mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View All Orders ({selectedCustomerOrders.length})
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a customer to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;