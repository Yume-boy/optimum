import React, { useState, useEffect } from 'react'; // Import useEffect
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import { addDriver, fetchDrivers,  } from '../../Auth/slices/driverSlice'; // Import addDriver and fetchDrivers thunks, and Driver type
import type { RootState } from '../../Auth/store'; // Adjust path for your store

interface NewDriverForm {
  fullname: string;
  email: string;
  phone: string;
  vehicle_type: string;
  vehicle_no: string;
  license_no: string;
  password: string;
  password_confirmation: string; 
}

interface DriverManagementProps {
  // `drivers` prop is no longer needed as it will be fetched from Redux
  handleDeleteDriver: (driverId: string) => void;
  handleToggleDriverStatus: (driverId: string, isActive: boolean) => void;
}

const DriverManagement: React.FC<DriverManagementProps> = ({ handleDeleteDriver, handleToggleDriverStatus }) => {
  const [showNewDriverForm, setShowNewDriverForm] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<NewDriverForm>();
  const dispatch = useDispatch();

  // Select drivers, loading state, and error from the Redux store
  const { drivers, loading, error } = useSelector((state: RootState) => state.driver);

  // Fetch drivers when the component mounts
  useEffect(() => {
    dispatch(fetchDrivers() as any); // Type assertion for async thunk
  }, [dispatch]); // Dependency array ensures it runs only on mount or dispatch changes

  const onSubmit = (data: NewDriverForm) => {
    if (data.password !== data.password_confirmation) {
      alert('Password and password confirmation do not match.');
      return;
    }
    
    dispatch(addDriver(data));

    
    // reset();
    // setShowNewDriverForm(false);
    // alert('Driver added successfully!'); // This alert should ideally be triggered by Redux success state
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Driver Management</h3>
        <button
          onClick={() => setShowNewDriverForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Driver</span>
        </button>
      </div>

      {showNewDriverForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Add New Driver</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                {...register('fullname', { required: 'Full Name is required' })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                {...register('phone', { required: 'Phone Number is required' })}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select
                {...register('vehicle_type', { required: 'Vehicle Type is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select vehicle type</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
              {errors.vehicle_type && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicle_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
              <input
                {...register('vehicle_no', { required: 'Vehicle Number is required' })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.vehicle_no && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicle_no.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                {...register('license_no', { required: 'License Number is required' })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.license_no && (
                <p className="mt-1 text-sm text-red-600">{errors.license_no.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Confirmation</label>
              <input
                {...register('password_confirmation', {
                  required: 'Password confirmation is required',
                  validate: (value) => {
                  const passwordValue = getValues('password');
                  return value === passwordValue || 'Passwords do not match';
                }
                })}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700"
              >
                Add Driver
              </button>
              <button
                type="button"
                onClick={() => setShowNewDriverForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {
      loading ?  <div className="text-center py-8">Loading staff members...</div> : error ? <div className="text-center py-8 text-red-600">Error: {error}</div>
    : 
    
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No drivers added yet.
                </td>
              </tr>
            ) : (
              drivers?.map((driver) => ( // Use `drivers` from Redux state
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{driver.fullname}</div>
                      <div className="text-sm text-gray-500">License: {driver.license_no}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.vehicle_type}</div>
                    <div className="text-sm text-gray-500">{driver.vehicle_no}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      driver.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.rating}★ ({driver.totalDeliveries} deliveries)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleToggleDriverStatus(driver.id, driver.isAvailable)}
                      className={`${
                        driver.isAvailable ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {driver.isAvailable ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    }

    </div>
  );
};

export default DriverManagement;