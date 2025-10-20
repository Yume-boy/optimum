'use client'
import React, { useState, useEffect } from 'react';
import { Package, User, MapPin, DollarSign, Clock, Search, Filter, Plus, Edit, Trash2, X } from 'lucide-react'; // Added 'X' for modal close
import { useFetchResourceQuery, useCreateResourceMutation } from '@/redux/api/crudApi';
import { useRouter } from 'next/navigation';


// Assuming Driver interface from driverSlice.ts
// Ensure this matches your actual Driver interface in driverSlice.ts
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  // isAvailable?: boolean; // Add this if your Driver objects have this property
}

// NOTE: Placeholder interface to prevent TypeScript errors in the body, 
// as the original code was missing a full Order definition.
interface NewOrderPayload {
    user_id?: number; 
    pickup_address: string;
    delivery_address: string;
    category?: string;
    weight?: string;
    quantity?: number;
    special_instruction?: string;
    delivery_type?: string;
    recipient_id?: string;
    amount: number;
    status?: string;
    driver_id?: string | null;
}

const OrderManagement: React.FC = () => {

  const {data: orders, isLoading: ordersLoading, isError: ordersError} = useFetchResourceQuery('/orders/all')
  const [createOrder, {isLoading}] = useCreateResourceMutation()

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);

  const user_id =sessionStorage.getItem('user_id')

  const router = useRouter()

  
  // State for new/edited order data, matching the API's snake_case fields for payload
  const [newOrderData, setNewOrderData] = useState<NewOrderPayload>({ // Using the placeholder interface
    // user_id: user_id, // Customer ID
    pickup_address: '',
    delivery_address: '',
    // category: '', // This is 'itemDescription' in UI, but 'category' in API
    // weight: '', // API returns as string e.g., "11kg"
    // quantity: 0,
    // description: '', // Removed based on original snippet
    // delivery_type: '',
    // recipient_id: '', // Assuming this is a string URL
    amount: 0, // Assuming amount is sent, even if not returned in fetch
    // status: 'pending', // Default status for new orders
    // driver_id: null, // Default driver for new orders
  });

  const [editingOrder, setEditingOrder] = useState<any>(null); // State to hold order being edited


  const filteredOrders = orders?.data?.filter((order:any) => {
    const matchesSearch = order.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = async () => {

    try {
      await createOrder({
        data: newOrderData,
        url: '/orders/create'
      }).unwrap()
      router.refresh()
    } catch(err){
    console.log('something went wrong')
    }
    
    // Dispatch addOrder with data matching the thunk's expected payload // Cast to any to match the thunk's Omit type
    
    setShowCreateOrderModal(false);
    setNewOrderData({ // Reset form - Using the original reset logic (assuming these fields were meant to be in the original state)
        driver_id: null, status: 'pending', pickup_address: '', delivery_address: '',
        category: '', weight: '', quantity: 0, special_instruction: '', delivery_type: '', recipient_id: '', amount: 0,
    } as any); // Cast to any to match the slightly inconsistent original reset
  };

  const handleEditOrder = (order:any) => {
    setEditingOrder(order);
    setShowCreateOrderModal(true); // Reuse modal for editing
    setNewOrderData({ // Pre-fill modal with current order data, mapping from Order interface
      // user_id: order.user_id,
      pickup_address: order.pickup_address,
      delivery_address: order.delivery_address,
      // category: order.category,
      // weight: order.weight,
      // quantity: order.quantity,
      description: order.description == null ? '' : order.description, // This was 'description' in your state map
      // delivery_type: order.delivery_type,
      // recipient_id: order.recipient_id,
      amount: order.amount,
      // status: order.status,
      // driver_id: order.driverId, // Use driverId from the Order interface
    } as any); // Cast to any to match the slightly inconsistent original object structure
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;


    // Dispatch editOrder with data matching the thunk's expected payload
    // (omitted the commented-out logic)

    setShowCreateOrderModal(false);
    setEditingOrder(null); // Clear editing state
    setNewOrderData({ // Reset form
      user_id: 0, driver_id: null, status: 'pending', pickup_address: '', delivery_address: '',
      category: '', weight: '', quantity: 0, special_instruction: '', delivery_type: '', recipient_id: '', amount: 0,
    } as any);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) { // Consider a custom modal/toast

    }
  };

  // Helper function from original commented code (reintroduced for status styling in mobile view)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800'; 
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="ml-4 text-gray-600">Loading orders and drivers...</p>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded-lg">
        {/* Adjusted to display error gracefully, matching the original spirit */}
        <p>Error loading data: An error occurred.</p> 
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6"> {/* Added padding for small screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <button 
          onClick={() => {
            setEditingOrder(null); // Clear editing state
            setNewOrderData({ // Reset form for new order (using original reset logic)
              user_id: 0, driver_id: null, status: 'pending', pickup_address: '', delivery_address: '',
              category: '', weight: '', quantity: 0, special_instruction: '', delivery_type: '', recipient_id: '', amount: 0,
            } as any);
            setShowCreateOrderModal(true);
          }}
          className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center sm:justify-start space-x-2 transition duration-150"
        >
          <Plus className="h-5 w-5" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto"> {/* Added w-full */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search route or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Corrected padding/width for mobile
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
              />
            </div>
            <div className="relative w-full sm:w-auto"> {/* Added w-full */}
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                // Corrected padding/width and added appearance-none for better cross-browser consistency
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none w-full"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="picked_up">Picked Up</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredOrders?.length} orders found
          </div>
        </div>
      </div>

      {/* Orders Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        {/* **Desktop Table View** */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> {/* Added Status column for completeness */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        Customer {order.user_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                        <span className="truncate max-w-xs">
                          From: {order.pickup_address}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                        <span className="truncate max-w-xs">
                          To: {order.delivery_address}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Status Column for Desktop */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status ? order.status.replace(/_/g, ' ') : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ₦{order.amount || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-blue-600 hover:text-blue-900 transition"
                        title="Edit Order"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900 transition"
                        title="Delete Order"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* **Mobile Card View** */}
        <div className="md:hidden divide-y divide-gray-200 p-4">
          {filteredOrders?.map((order: any) => (
            <div key={order.id} className="py-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="text-lg font-bold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-emerald-600" />
                  <span>Order #{order.id}</span>
                </div>
                {/* Status Badge */}
                <span 
                  className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                >
                  {order.status ? order.status.replace(/_/g, ' ') : 'N/A'}
                </span>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Customer: **{order.user_id || "N/A"}**</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                  <span>**From:** {order.pickup_address}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                  <span>**To:** {order.delivery_address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>**Amount:** <span className="font-semibold text-gray-900">₦{order.amount || "N/A"}</span></span>
                </div>
              </div>

              <div className="flex space-x-4 pt-2 border-t border-gray-100 mt-3">
                <button
                  onClick={() => handleEditOrder(order)}
                  className="flex items-center text-blue-600 hover:text-blue-900 text-sm font-medium transition"
                  title="Edit Order"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="flex items-center text-red-600 hover:text-red-900 text-sm font-medium transition"
                  title="Delete Order"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
          {filteredOrders?.length === 0 && (
            <div className="text-center py-6 text-gray-500">No orders found.</div>
          )}
        </div>
      </div>


      {/* Stats Cards - Adjusted to sm:grid-cols-2 for tablet view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders?.data?.filter((o:any) => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Processing Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders?.data?.filter((o:any) => o.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders?.data?.filter((o:any) => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              {/* This calculation is rough but retains the original component's structure */}
              <p className="text-2xl font-bold text-gray-900">
                {/* ₦{(orders?.data?.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) || 0).toFixed(2)} */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-0 sm:p-4 z-50">
          {/* Modal content: w-full h-full on small screens, max-w-md h-auto on medium screens and up */}
          <div className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-w-md overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{editingOrder ? 'Edit Order' : 'Create New Order'}</h2>
                <button
                    onClick={() => setShowCreateOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); editingOrder ? handleUpdateOrder() : handleCreateOrder(); }} className="space-y-4">
                
                {/* All fields were made fully responsive by default or using grid-cols-1 sm:grid-cols-2 */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                  <input
                    type="text"
                    value={newOrderData.pickup_address}
                    onChange={(e) => setNewOrderData({ ...newOrderData, pickup_address: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Pickup Address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                  <input
                    type="text"
                    value={newOrderData.delivery_address}
                    onChange={(e) => setNewOrderData({ ...newOrderData, delivery_address: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Delivery Address"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Item Category</label>
                  <textarea
                    value={newOrderData.category}
                    onChange={(e) => setNewOrderData({ ...newOrderData, category: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., electronics, documents"
                    required
                  ></textarea>
                </div> */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (e.g., 5kg)</label>
                    <input
                      type="text"
                      value={newOrderData.weight}
                      onChange={(e) => setNewOrderData({ ...newOrderData, weight: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 5kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={newOrderData.quantity === 0 ? '' : newOrderData.quantity}
                      onChange={(e) => setNewOrderData({ ...newOrderData, quantity: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 2"
                    />
                  </div>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Special Instruction</label>
                  <textarea
                    value={newOrderData.special_instruction}
                    onChange={(e) => setNewOrderData({ ...newOrderData, special_instruction: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Handle with care"
                  ></textarea>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Type</label>
                  <input
                    type="text"
                    value={newOrderData.delivery_type}
                    onChange={(e) => setNewOrderData({ ...newOrderData, delivery_type: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., immediate, scheduled"
                  />
                </div> */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient ID (URL)</label>
                  <input
                    type="text"
                    value={newOrderData.recipient_id}
                    onChange={(e) => setNewOrderData({ ...newOrderData, recipient_id: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="URL to recipient ID image"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderData.amount === 0 ? '' : newOrderData.amount}
                    onChange={(e) => setNewOrderData({ ...newOrderData, amount: parseFloat(e.target.value) || 0 })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 25.50"
                    required
                  />
                </div>
                
                {editingOrder && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive Grid */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={newOrderData.status}
                        // onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value as Order['status'] })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assign Driver</label>
                      <select
                        value={newOrderData.driver_id || ''} // Use driver_id for state
                        onChange={(e) => setNewOrderData({ ...newOrderData, driver_id: e.target.value || null })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">No Driver Assigned</option>
                        {/* {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>{driver.name}</option>
                        ))} */}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateOrderModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
                  >
                    {editingOrder ? 'Update Order' : 'Create Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;