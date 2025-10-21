import React, { useState, useEffect } from 'react';
import { User, Key, Truck, MapPin, Save, Eye, EyeOff, Phone, Mail, Star, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
// import type { RootState } from '../../components/Auth/store'; // Adjust path to your Redux store type
// Import driver-specific auth actions (conceptual - you'll need to define these in driverAuthSlice.ts)
// import { updateDriverProfile, changeDriverPassword, updateDriverVehicleInfo } from '../../components/Auth/slices/driverAuthSlice';

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileForm {
  fullname: string; // Changed from 'name' to 'fullname' to match API response
  email: string;
  phone: string;
}

interface VehicleForm {
  vehicleType: string; // Changed from 'vehicle_type' to 'vehicleType' for camelCase consistency in form
  vehicleNumber: string; // Changed from 'vehicle_no'
  licenseNumber: string; // Changed from 'license_no'
}

const DriverSettings: React.FC = () => {
  const dispatch = useDispatch();
  // Select the driver user from the driverAuth slice
  // const driver = useSelector((state: RootState) => state.driverAuth.user);
  // const loading = useSelector((state: RootState) => state.driverAuth.loading);
  // const error = useSelector((state: RootState) => state.driverAuth.error);

  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  //Get driver credentials from storage
    const email = sessionStorage.getItem('email')
    const phone = sessionStorage.getItem('phone')
    const name = sessionStorage.getItem('user')
    const role = sessionStorage.getItem('role')
    const vehicle_type = sessionStorage.getItem('vehicle_type')
    const vehicle_no =   sessionStorage.getItem('vehicle_no')
    const license_no =     sessionStorage.getItem('license_no')

  // Initialize forms with driver data
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordChangeForm>();
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileForm>({
    defaultValues: {
      fullname: name ||  '',
      email: email || '',
      phone: phone || '',
    }
  });

  const { register: registerVehicle, handleSubmit: handleVehicleSubmit, formState: { errors: vehicleErrors }, reset: resetVehicle } = useForm<VehicleForm>({
    defaultValues: {
      vehicleType: vehicle_type || 'Motorcycle', // Use driver data
      vehicleNumber: vehicle_no || '',           // Use driver data
      licenseNumber: license_no || '',           // Use driver data
    }
  });

  // Effect to reset form defaults when driver data changes (e.g., after successful update or initial load)
  useEffect(() => {
    resetProfile({
      fullname: name || '',
      email: email || '',
      phone: phone || '',
    });
    resetVehicle({
      vehicleType: vehicle_type || 'Motorcycle',
      vehicleNumber: vehicle_no || '',
      licenseNumber: license_no || '',
    });
  }, [resetProfile, resetVehicle]); // Depend on driver and reset functions

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000); // Message disappears after 5 seconds
    return () => clearTimeout(timer);
  };

  const onPasswordSubmit = async (data: PasswordChangeForm) => {
    if (data.newPassword !== data.confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    // Dispatch password change thunk (conceptual)
    // try {
    //   await dispatch(changeDriverPassword(data) as any);
    //   showMessage('success', 'Password changed successfully!');
    //   resetPassword();
    // } catch (err: any) {
    //   showMessage('error', err.message || 'Failed to change password.');
    // }
    console.log('Password change:', data);
    showMessage('success', 'Password changed successfully (mock)!'); // Mock success
    resetPassword();
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    // Dispatch profile update thunk (conceptual)
    // try {
    //   await dispatch(updateDriverProfile(data) as any);
    //   showMessage('success', 'Profile updated successfully!');
    // } catch (err: any) {
    //   showMessage('error', err.message || 'Failed to update profile.');
    // }
    console.log('Profile update:', data);
    showMessage('success', 'Profile updated successfully (mock)!'); // Mock success
  };

  const onVehicleSubmit = async (data: VehicleForm) => {
    // Dispatch vehicle update thunk (conceptual)
    // try {
    //   await dispatch(updateDriverVehicleInfo(data) as any);
    //   showMessage('success', 'Vehicle information updated successfully!');
    // } catch (err: any) {
    //   showMessage('error', err.message || 'Failed to update vehicle information.');
    // }
    console.log('Vehicle update:', data);
    showMessage('success', 'Vehicle information updated successfully!'); // Mock success
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'vehicle', label: 'Vehicle Info', icon: Truck },
    { id: 'performance', label: 'Performance', icon: Star },
  ];

  if (role !== 'driver') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in as a driver to view settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-inter"> {/* Changed font-sans to font-inter */}
      {message && (
        <div className={`p-4 rounded-lg text-white ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}
      {/* {error && ( // Display Redux error if present
        <div className="p-4 rounded-lg text-white bg-red-500">
          Redux Error: {error}
        </div>
      )} */}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="hidden md:flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

           {/* Mobile Select Dropdown */}
          <div className="md:hidden px-4 py-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full rounded-md border-gray-300 text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerProfile('fullname', { required: 'Full name is required' })}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {profileErrors.fullname && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.fullname.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerProfile('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled // Email is often not directly editable via profile settings
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerProfile('phone')}
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  // disabled={loading} // Disable button during loading
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{'Save Changes'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerPassword('newPassword', { 
                        required: 'New password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerPassword('confirmPassword', { required: 'Please confirm your password' })}
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  // disabled={loading} // Disable button during loading
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{'Update Password'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'vehicle' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Information</h3>
              <form onSubmit={handleVehicleSubmit(onVehicleSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      {...registerVehicle('vehicleType', { required: 'Vehicle type is required' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>
                  {vehicleErrors.vehicleType && (
                    <p className="mt-1 text-sm text-red-600">{vehicleErrors.vehicleType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number
                  </label>
                  <input
                    {...registerVehicle('vehicleNumber', { required: 'Vehicle number is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="ABC-123"
                  />
                  {vehicleErrors.vehicleNumber && (
                    <p className="mt-1 text-sm text-red-600">{vehicleErrors.vehicleNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    {...registerVehicle('licenseNumber', { required: 'License number is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DL123456789"
                  />
                  {vehicleErrors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600">{vehicleErrors.licenseNumber.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  // disabled={loading} // Disable button during loading
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{ 'Update Vehicle Info'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-emerald-600">Rating</p>
                      <p className="text-2xl font-bold text-emerald-900">4.8</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Truck className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Deliveries</p>
                      <p className="text-2xl font-bold text-blue-900">150</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-purple-900">$2,500</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-orange-600">Distance Covered</p>
                      <p className="text-2xl font-bold text-orange-900">1,250 km</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Reviews</h4>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">5.0</span>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Excellent service! Package delivered on time and in perfect condition."
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- Customer #1234</p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">4.0</span>
                      </div>
                      <span className="text-sm text-gray-500">1 week ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Good driver, very professional and courteous."
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- Customer #5678</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverSettings;
