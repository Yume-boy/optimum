import React, { useState, useEffect } from 'react';
import { Truck, User, MapPin, Star, DollarSign, Package, Clock, Search, Filter, Eye, Edit, MoreVertical, Phone, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Auth/store'; // Assuming store.ts is in redux folder
import { fetchDrivers } from '../Auth/slices/driverSlice'; // Adjust path
import { Order } from '../Auth/slices/customersOrderSlice'; // Adjust path, assuming Order interface is exported

// Driver interface - Updated to match API response (snake_case)
// This should ideally be the interface defined in your driverSlice.ts
interface Driver {
  id: string; // API returns number, but often converted to string for consistent keys
  fullname: string; // From API: fullname
  email: string;
  phone: string;
  vehicle_type: string; // From API: vehicle_type
  vehicle_no: string; // From API: vehicle_no
  license_no: string; // From API: license_no
  created_at: string;
  updated_at: string;
  role: string;
  // Properties below are not directly from the provided API response,
  // they are assumed or would be derived/calculated on the frontend or backend.
  isAvailable?: boolean; // Assumed property, not in API response
  rating?: number; // Assumed property, not in API response
  totalDeliveries?: number; // Assumed property, not in API response
  earnings?: number; // Assumed property, not in API response
}

const DriverManagement: React.FC = () => {
  const dispatch = useDispatch();
  // Access drivers, orders, and authentication token from the Redux store
  // Assuming 'driver' is the key for driverSlice and 'customerOrder' for customersOrderSlice in your rootReducer
  const { drivers, loading: driversLoading, error: driversError } = useSelector((state: RootState) => state.driver); 
  const { orders } = useSelector((state: RootState) => state.customerOrder); 
  const authToken = useSelector((state: RootState) => state.auth.token); // Get the token from the auth slice

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Fetch drivers and orders on component mount, but only if authToken is available
  useEffect(() => {
    if (authToken) { // Only dispatch fetches if the authentication token exists
      dispatch(fetchDrivers() as any); // Cast to any to bypass potential type issues with thunk dispatch
      // If you need to fetch ALL orders for admin/staff view, you'd dispatch a thunk here
      // For now, 'orders' state is assumed to be populated by another part of the app for this component's use.
    }
  }, [dispatch, authToken]); // Add authToken to the dependency array

  const filteredDrivers = drivers.filter(driver => {
    // Search by fullname, ID, vehicle type, or vehicle number (using snake_case from API)
    const matchesSearch = (driver.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
                          (driver.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || '') || // Convert ID to string for search
                          (driver.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
                          (driver.vehicle_no?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    
    // For isAvailable, if not provided by API, assume true for filtering purposes unless explicitly busy.
    // In a real app, this would come from the backend or be derived from driver's active orders.
    const isDriverAvailable = driver.isAvailable !== undefined ? driver.isAvailable : true; // Default to available if not specified
    
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'available' && isDriverAvailable) ||
                          (statusFilter === 'busy' && !isDriverAvailable);
    return matchesSearch && matchesStatus;
  });

  const getDriverOrders = (driverId: string) => {
    // Filter orders by driverId. Ensure order.driverId is string for comparison.
    return orders.filter(order => order.driverId?.toString() === driverId.toString());
  };

  const getCurrentDelivery = (driverId: string) => {
    // Assuming 'processing' is the status for current deliveries based on previous discussion
    return orders.find(order => order.driverId?.toString() === driverId.toString() && order.status === 'processing');
  };

  const getStatusColor = (isAvailable: boolean | undefined) => { // isAvailable can be undefined, so handle gracefully
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const selectedDriverData = selectedDriver ? drivers.find(d => d.id?.toString() === selectedDriver.toString()) : null;
  const selectedDriverOrders = selectedDriver ? getDriverOrders(selectedDriver) : [];
  const currentDelivery = selectedDriver ? getCurrentDelivery(selectedDriver) : null;

  if (driversLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="ml-4 text-gray-600">Loading drivers...</p>
      </div>
    );
  }

  if (driversError) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded-lg">
        <p>Error loading drivers: {driversError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {/* Filter by the assumed 'isAvailable' property, defaulting to true if not present */}
            {drivers.filter(d => d.isAvailable !== undefined ? d.isAvailable : true).length} available • 
            {drivers.filter(d => d.isAvailable !== undefined ? !d.isAvailable : false).length} busy
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
                placeholder="Search drivers..."
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
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredDrivers.length} drivers found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drivers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Drivers</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredDrivers.map((driver) => {
                const driverOrders = getDriverOrders(driver.id.toString()); // Ensure ID is string for comparison
                const currentOrder = getCurrentDelivery(driver.id.toString()); // Ensure ID is string for comparison
                
                return (
                  <div 
                    key={driver.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedDriver === driver.id.toString() ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}`}
                    onClick={() => setSelectedDriver(driver.id.toString())} // Set selected driver ID as string
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          <Truck className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{driver.fullname || `Driver ${driver.id}`}</h4>
                          <p className="text-sm text-gray-600">{driver.vehicle_type} • {driver.vehicle_no}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.isAvailable)}`}>
                              {driver.isAvailable ? 'Available' : 'Busy'}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{driver.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{driverOrders.length} orders</p>
                        <p className="text-sm text-gray-600">${driver.earnings?.toFixed(2) || '0.00'}</p>
                        {currentOrder && (
                          <p className="text-xs text-orange-600 mt-1">In delivery</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Driver Details */}
        <div className="space-y-6">
          {selectedDriverData ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Driver Details</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedDriverData.fullname || `Driver ${selectedDriverData.id}`}</h4>
                      <p className="text-sm text-gray-600">License: {selectedDriverData.license_no}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-900">Rating</span>
                      </div>
                      <p className="text-lg font-bold text-emerald-900">{selectedDriverData.rating?.toFixed(1) || 'N/A'}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Deliveries</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900">{selectedDriverData.totalDeliveries || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Earnings</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900">${selectedDriverData.earnings?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">Status</span>
                      </div>
                      <p className="text-sm font-bold text-orange-900">
                        {selectedDriverData.isAvailable ? 'Available' : 'Busy'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Vehicle Information</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Type:</span> {selectedDriverData.vehicle_type}</p>
                      <p><span className="font-medium">Number:</span> {selectedDriverData.vehicle_no}</p>
                      <p><span className="font-medium">License:</span> {selectedDriverData.license_no}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Call
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Delivery */}
              {currentDelivery && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Delivery</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Order ID</span>
                      <span className="text-sm text-gray-900">#{currentDelivery.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Category</span>
                      <span className="text-sm text-gray-900">{currentDelivery.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Amount</span>
                      <span className="text-sm font-medium text-gray-900">${currentDelivery.price?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Pickup</p>
                      <p className="text-sm text-gray-900">{currentDelivery.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Delivery</p>
                      <p className="text-sm text-gray-900">{currentDelivery.delivery_address}</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700">
                    Track Delivery
                  </button>
                </div>
              )}

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {selectedDriverOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                        <p className="text-xs text-gray-600">{order.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${order.price?.toFixed(2) || 'N/A'}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedDriverOrders.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent orders for this driver.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a driver to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
