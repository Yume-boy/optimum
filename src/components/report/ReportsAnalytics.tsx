import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, Truck, Users, Calendar, Download, Filter, Eye } from 'lucide-react';


const ReportsAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  // Mock data for comprehensive analytics
  const monthlyRevenue = [
    { month: 'Jan', revenue: 8500, orders: 45, drivers: 12 },
    { month: 'Feb', revenue: 9200, orders: 52, drivers: 14 },
    { month: 'Mar', revenue: 10800, orders: 61, drivers: 16 },
    { month: 'Apr', revenue: 12400, orders: 68, drivers: 18 },
    { month: 'May', revenue: 15450, orders: 78, drivers: 20 },
    { month: 'Jun', revenue: 14200, orders: 72, drivers: 19 },
  ];

  const dailyOrders = [
    { day: 'Mon', delivered: 12, pending: 8, cancelled: 2 },
    { day: 'Tue', delivered: 15, pending: 5, cancelled: 1 },
    { day: 'Wed', delivered: 18, pending: 7, cancelled: 3 },
    { day: 'Thu', delivered: 14, pending: 6, cancelled: 2 },
    { day: 'Fri', delivered: 20, pending: 4, cancelled: 1 },
    { day: 'Sat', delivered: 16, pending: 9, cancelled: 2 },
    { day: 'Sun', delivered: 10, pending: 3, cancelled: 1 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Food', value: 20, color: '#F59E0B' },
    { name: 'Documents', value: 12, color: '#EF4444' },
    { name: 'Other', value: 8, color: '#8B5CF6' },
  ];

  const driverPerformance = [
    { name: 'Driver 1', deliveries: 45, rating: 4.8, earnings: 2250 },
    { name: 'Driver 2', deliveries: 38, rating: 4.6, earnings: 1900 },
    { name: 'Driver 3', deliveries: 42, rating: 4.9, earnings: 2100 },
    { name: 'Driver 4', deliveries: 35, rating: 4.5, earnings: 1750 },
    { name: 'Driver 5', deliveries: 40, rating: 4.7, earnings: 2000 },
  ];

  const hourlyActivity = [
    { hour: '6AM', orders: 2 }, { hour: '7AM', orders: 5 }, { hour: '8AM', orders: 12 },
    { hour: '9AM', orders: 18 }, { hour: '10AM', orders: 25 }, { hour: '11AM', orders: 22 },
    { hour: '12PM', orders: 28 }, { hour: '1PM', orders: 32 }, { hour: '2PM', orders: 30 },
    { hour: '3PM', orders: 26 }, { hour: '4PM', orders: 24 }, { hour: '5PM', orders: 20 },
    { hour: '6PM', orders: 15 }, { hour: '7PM', orders: 10 }, { hour: '8PM', orders: 8 },
    { hour: '9PM', orders: 5 }, { hour: '10PM', orders: 3 }, { hour: '11PM', orders: 1 },
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$45,250',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Orders',
      value: '1,248',
      change: '+8.2%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Drivers',
      value: '24',
      change: '+15.0%',
      trend: 'up',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const exportReport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting report as ${format.toUpperCase()}`);
    // Implementation for export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => exportReport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'financial', label: 'Financial' },
              { id: 'operations', label: 'Operations' },
              { id: 'drivers', label: 'Driver Performance' },
              { id: 'customers', label: 'Customer Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  reportType === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {reportType === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${kpi.color}`} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">{kpi.change}</span>
                        <span className="text-sm text-gray-500 ml-2">vs last period</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Order Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyOrders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="delivered" fill="#10B981" />
                      <Bar dataKey="pending" fill="#F59E0B" />
                      <Bar dataKey="cancelled" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {categoryData.map((entry) => (
                      <div key={entry.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hourly Activity */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Order Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {reportType === 'financial' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fees</span>
                      <span className="font-medium">$32,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">$8,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Express Delivery</span>
                      <span className="font-medium">$4,600</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>$45,250</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Card</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wallet</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cash</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Top Earning Days</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Friday</span>
                      <span className="font-medium">$8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thursday</span>
                      <span className="font-medium">$7,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wednesday</span>
                      <span className="font-medium">$6,800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'drivers' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={driverPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deliveries" fill="#3B82F6" />
                    <Bar dataKey="earnings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Driver Leaderboard</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {driverPerformance.map((driver, index) => (
                        <tr key={driver.name}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {driver.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {driver.deliveries}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {driver.rating}★
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${driver.earnings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-emerald-500 h-2 rounded-full" 
                                  style={{ width: `${(driver.deliveries / 50) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{Math.round((driver.deliveries / 50) * 100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(reportType === 'operations' || reportType === 'customers') && (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {reportType === 'operations' ? 'Operations Analytics' : 'Customer Analytics'}
              </h3>
              <p className="text-gray-600">
                Detailed {reportType} reports and analytics coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;