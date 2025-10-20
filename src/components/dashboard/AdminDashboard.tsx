'use Client'
import React from 'react';
import { Package, Truck, MapPin, DollarSign, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFetchResourceQuery } from '@/redux/api/crudApi';


const AdminDashboard: React.FC = () => {

    const {data: totalOrder, isLoading: totalOrderLoading, isError: totalOrderError} = useFetchResourceQuery('/superadmin/total-orders')
    const {data: dashBoard, isLoading: dashBoardLoading, isError: dashBoardError} = useFetchResourceQuery('/superadmin/dashboard')
    const {data: orderCount, isLoading: orderCountLoading, isError: orderCountError} = useFetchResourceQuery('/superadmin/order-status-counts')
    const {data: recentOrder, isLoading: recentOrderLoading, isError: recentOrderError} = useFetchResourceQuery('/superadmin/recent-orders')
    const {data: topDriver, isLoading: topDriverLoading, isError: topDriverError} = useFetchResourceQuery('/superadmin/top-rated-drivers')
    const {data: monthlyRevenue, isLoading: monthlyRevenueLoading, isError: monthlyRevenueError} = useFetchResourceQuery('/superadmin/revenue-by-month')
    const {data: activeDriver, isLoading: activeDriverLoading, isError: activeDriverError} = useFetchResourceQuery('/superadmin/active-drivers')
    const {data: totalRevenue, isLoading: totalRevenueLoading, isError: totalRevenueError} = useFetchResourceQuery('/superadmin/total-revenue')
    const {data: pendingDeliveries, isLoading: pendingDeliveriesLoading, isError: pendingDeliveriesError} = useFetchResourceQuery('/superadmin/delivered-pending-by-day-this-week')




  // // Handle loading and error states for a better user experience
  // if (loading) {
  //   return <div className="flex items-center justify-center h-screen text-gray-700">Loading dashboard data...</div>;
  // }

  // // if (error) {
  // //   return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  // // }

  // Define the colors for the Pie Chart slices
  const PIE_COLORS = ['#059669', '#2563eb', '#ea580c', '#dc2626']; // Delivered, In Transit, Pending, Cancelled

  // // Create a dynamic stats array from the fetched summary data
  const stats = dashBoard ? [
    {
      title: 'Total Orders',
      value: dashBoard.total_orders,
      change: '+12%', // Static for now, can be made dynamic
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Drivers',
      value: dashBoard.active_drivers,
      change: '+3%',
      icon: Truck,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Revenue',
      value: `₦${dashBoard.total_revenue?.toLocaleString()}`,
      change: '+25%',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ] : [];

  //  dynamic pie chart data array from the order status counts
  const orderStatusPieData = dashBoard?.order_status_counts ? [
    { name: 'Delivered', value: dashBoard?.order_status_counts.delivered },
    { name: 'In Transit', value: dashBoard?.order_status_counts.in_transit },
    { name: 'Pending', value: dashBoard?.order_status_counts.pending },
    { name: 'Cancelled', value: dashBoard?.order_status_counts.cancelled },
  ] : [];



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Deliveries</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={
                // deliveriesByDay 
                 []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delivered_count" name="Delivered" fill="#059669" />
                <Bar dataKey="pending_count" name="Pending" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={
                // revenueByMonth || 
                []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusPieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {orderStatusPieData?.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {
                recentOrder?.recent_order?.length > 0 ?
              
              recentOrder?.recent_order?.slice(0, 5).map((order:any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.price.toLocaleString()}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
              :
               ''
            
            }
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Drivers</h3>
            <div className="space-y-3">
              {
                topDriver?.top_rated_driver?.length > 0 ?
                topDriver?.top_rated_driver?.slice(0, 5).map((driver:any, index:number) => (
                <div key={driver.driver_id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-600">{driver.deliveries_completed} deliveries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{driver.rating}★</p>
                  </div>
                </div>
              ))
            :
            ""
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
