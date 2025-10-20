import React, { useState, useEffect } from 'react';
import { Package, User, MapPin, DollarSign, Clock, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../components/Auth/store'; // Adjust path to your Redux store
import { fetchOrders, addOrder, editOrder, deleteOrder, Order } from '../../components/Auth/slices/orderSlice'; // Import order thunks and Order interface
import { fetchDrivers } from '../../components/Auth/slices/driverSlice'; // Import fetchDrivers

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

const OrderManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state: RootState) => state.order);
  const { drivers, loading: driversLoading, error: driversError } = useSelector((state: RootState) => state.driver);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  
  // State for new/edited order data, matching the API's snake_case fields for payload
  const [newOrderData, setNewOrderData] = useState<Omit<Order, "id" | "created_at" | "updated_at" | "driverId"> & { driver_id?: string | null }>({
    user_id: 0, // Customer ID
    pickup_address: '',
    delivery_address: '',
    category: '', // This is 'itemDescription' in UI, but 'category' in API
    weight: '', // API returns as string e.g., "11kg"
    quantity: 0,
    special_instruction: '',
    delivery_type: '',
    recipient_id: '', // Assuming this is a string URL
    price: 0, // Assuming price is sent, even if not returned in fetch
    status: 'pending', // Default status for new orders
    driver_id: null, // Default driver for new orders
  });

  const [editingOrder, setEditingOrder] = useState<Order | null>(null); // State to hold order being edited

  // Fetch orders and drivers on component mount
  useEffect(() => {
    dispatch(fetchOrders() as any);
    dispatch(fetchDrivers() as any);
  }, [dispatch]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order?.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) || // Convert ID to string for search
                          order?.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order?.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order?.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = async () => {
    // Basic validation
    if (!newOrderData.user_id || !newOrderData.pickup_address || !newOrderData.delivery_address || !newOrderData.category || newOrderData.price <= 0) {
      alert('Please fill all required fields and ensure price is greater than 0.'); // Consider a custom modal/toast
      return;
    }
    
    // Dispatch addOrder with data matching the thunk's expected payload
    await dispatch(addOrder(newOrderData as any)); // Cast to any to match the thunk's Omit type
    
    setShowCreateOrderModal(false);
    setNewOrderData({ // Reset form
      user_id: 0, driver_id: null, status: 'pending', pickup_address: '', delivery_address: '',
      category: '', weight: '', quantity: 0, special_instruction: '', delivery_type: '', recipient_id: '', price: 0,
    });
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowCreateOrderModal(true); // Reuse modal for editing
    setNewOrderData({ // Pre-fill modal with current order data, mapping from Order interface
      user_id: order.user_id,
      pickup_address: order.pickup_address,
      delivery_address: order.delivery_address,
      category: order.category,
      weight: order.weight,
      quantity: order.quantity,
      special_instruction: order.special_instruction,
      delivery_type: order.delivery_type,
      recipient_id: order.recipient_id,
      price: order.price,
      status: order.status,
      driver_id: order.driverId, // Use driverId from the Order interface
    });
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    // Basic validation
    if (!newOrderData.user_id || !newOrderData.pickup_address || !newOrderData.delivery_address || !newOrderData.category || newOrderData.price <= 0) {
      alert('Please fill all required fields and ensure price is greater than 0.'); // Consider a custom modal/toast
      return;
    }

    // Dispatch editOrder with data matching the thunk's expected payload
    await dispatch(editOrder({ 
      id: editingOrder.id, 
      order: {
        user_id: newOrderData.user_id,
        pickup_address: newOrderData.pickup_address,
        delivery_address: newOrderData.delivery_address,
        category: newOrderData.category,
        weight: newOrderData.weight,
        quantity: newOrderData.quantity,
        special_instruction: newOrderData.special_instruction,
        delivery_type: newOrderData.delivery_type,
        recipient_id: newOrderData.recipient_id,
        price: newOrderData.price,
        status: newOrderData.status,
        driver_id: newOrderData.driver_id, // Use driver_id for the payload
      }
    }) as any); 

    setShowCreateOrderModal(false);
    setEditingOrder(null); // Clear editing state
    setNewOrderData({ // Reset form
      user_id: 0, driver_id: null, status: 'pending', pickup_address: '', delivery_address: '',
      category: '', weight: '', quantity: 0, special_instruction: '', delivery_type: '', recipient_id: '', price: 0,
    });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) { // Consider a custom modal/toast
      await dispatch(deleteOrder(orderId) as any);
    }
  };

  const handleAssignDriver = async (orderId: string, driverId: string) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (orderToUpdate) {
      await dispatch(editOrder({ 
        id: orderId, 
        order: { 
          driver_id: driverId, // Send driver_id to the API
          status: 'processing' // Automatically set status to 'processing' or 'picked_up' upon assignment
        } 
      }) as any);
    }
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (orderToUpdate) {
      await dispatch(editOrder({ 
        id: orderId, 
        order: { status: status } 
      }) as any);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800'; 
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (ordersLoading || driversLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="ml-4 text-gray-600">Loading orders and drivers...</p>
      </div>
    );
  }

  if (ordersError || driversError) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded-lg">
        <p>Error loading data: {ordersError || driversError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        {/* <button 
          onClick={() => {
            setEditingOrder(null); // Clear editing state
            setNewOrderData({ // Reset form for new order
              user_id: 0, driver_id: null, status: 'pending', pickup_address: '', delivery_address: '',
              category: '', weight: '', quantity: 0, special_instruction: '', delivery_type: '', recipient_id: '', price: 0,
            });
            setShowCreateOrderModal(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Order</span>
        </button> */}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
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
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="picked_up">Picked Up</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredOrders.length} orders found
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">Customer {order.user_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="truncate max-w-xs">From: {order.pickup_address}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="truncate max-w-xs">To: {order.delivery_address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {/* {order.status.replace('_', ' ')} */}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.driverId ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        Driver {drivers.find(d => d.id === order.driverId)?.name || order.driverId}
                      </div>
                    ) : (
                      <select
                        onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Assign driver</option>
                        {/* Filter drivers if they have an 'isAvailable' property */}
                        {drivers?.drivers?.data?.map(driver => ( 
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      {/* Using order.price, but note it's not in the provided API response, so it might be 0 or undefined */}
                      {/* <span className="text-sm font-medium text-gray-900">${order.price?.toFixed(2) || 'N/A'}</span> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Order"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Order"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Processing Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              {/* Using order.price, but note it's not in the provided API response, so it might be 0 or undefined */}
              {/* <p className="text-2xl font-bold text-gray-900">
                ${orders.reduce((sum, o) => sum + (o.price || 0), 0).toFixed(2)}
              </p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed  h-[100vh] inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingOrder ? 'Edit Order' : 'Create New Order'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); editingOrder ? handleUpdateOrder() : handleCreateOrder(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                <input
                  type="number" // Changed to number as user_id is number
                  value={newOrderData.user_id === 0 ? '' : newOrderData.user_id} // Handle 0 as empty for input
                  onChange={(e) => setNewOrderData({ ...newOrderData, user_id: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Customer ID"
                  required
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Category</label> {/* Changed label */}
                <textarea
                  value={newOrderData.category} // Use category
                  onChange={(e) => setNewOrderData({ ...newOrderData, category: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., electronics, documents"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (e.g., 5kg)</label> {/* Updated label */}
                  <input
                    type="text" // Keep as text to allow "11kg" format
                    value={newOrderData.weight}
                    onChange={(e) => setNewOrderData({ ...newOrderData, weight: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 5kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label> {/* New field */}
                  <input
                    type="number"
                    value={newOrderData.quantity === 0 ? '' : newOrderData.quantity}
                    onChange={(e) => setNewOrderData({ ...newOrderData, quantity: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Special Instruction</label> {/* New field */}
                <textarea
                  value={newOrderData.special_instruction}
                  onChange={(e) => setNewOrderData({ ...newOrderData, special_instruction: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Handle with care"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Type</label> {/* New field */}
                <input
                  type="text"
                  value={newOrderData.delivery_type}
                  onChange={(e) => setNewOrderData({ ...newOrderData, delivery_type: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., immediate, scheduled"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient ID (URL)</label> {/* New field */}
                <input
                  type="text"
                  value={newOrderData.recipient_id}
                  onChange={(e) => setNewOrderData({ ...newOrderData, recipient_id: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="URL to recipient ID image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newOrderData.price === 0 ? '' : newOrderData.price} // Handle 0 as empty for input
                  onChange={(e) => setNewOrderData({ ...newOrderData, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 25.50"
                  required
                />
              </div>
              {/* Status and Driver only editable for existing orders if needed */}
              {editingOrder && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={newOrderData.status}
                      onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value as Order['status'] })}
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
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateOrderModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
