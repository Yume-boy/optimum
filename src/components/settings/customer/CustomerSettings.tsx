import React, { useState, useEffect } from 'react';
import { User, Key, MapPin, CreditCard, Save, Eye, EyeOff, Phone, Mail, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';


interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

interface AddressForm {
  homeAddress: string;
  workAddress: string;
  otherAddress: string;
}

interface NotificationForm {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

const CustomerSettings: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);


      const name =  sessionStorage.getItem('user')
      const email =  sessionStorage.getItem('email')
      const phone =  sessionStorage.getItem('phone')
      const home_address =  sessionStorage.getItem('home_address')
      const work_address =  sessionStorage.getItem('work_address')
      const other_address =  sessionStorage.getItem('other_address')

  // Declare useForm hooks BEFORE any useEffect that uses their methods
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors }, 
    reset: resetPassword 
  } = useForm<PasswordChangeForm>();

  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors },
    setValue: setProfileValue, // Get setValue for ProfileForm
    reset: resetProfileForm // Get reset for ProfileForm
  } = useForm<ProfileForm>({
    // Initial default values. These will be overwritten by useEffect if user data loads later.
    defaultValues: {
      name: name || '',
      email: email || '',
      phone: phone || '',
    }
  });

  const { 
    register: registerAddress, 
    handleSubmit: handleAddressSubmit, 
    formState: { errors: addressErrors },
    setValue: setAddressValue, // Get setValue for AddressForm
    reset: resetAddressForm // Get reset for AddressForm
  } = useForm<AddressForm>({
    defaultValues: {
      homeAddress: home_address || '',
      workAddress: work_address || '',
      otherAddress: other_address || '',
    }
  });

  const { 
    register: registerNotifications, 
    handleSubmit: handleNotificationsSubmit,
    setValue: setNotificationValue // Get setValue for NotificationForm
  } = useForm<NotificationForm>({
    defaultValues: {
      emailNotifications: true, 
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      promotions: false,
    }
  });

  // Use useEffect to populate form fields when user data from Redux becomes available or changes
  // useEffect(() => {
  //   if (user) {
  //     // Set values for Profile Form
  //     setProfileValue('name', user.name || '');
  //     setProfileValue('email', user.email || '');
  //     setProfileValue('phone', user.phone || '');

  //     // Set values for Address Form
  //     setAddressValue('homeAddress', user.home_address || '');
  //     setAddressValue('workAddress', user.work_address || '');
  //     setAddressValue('otherAddress', user.other_address || '');

  //     // Set values for Notification Form (if preferences are stored on user object)
  //     // Example: setNotificationValue('emailNotifications', user.preferences?.emailNotifications || false);
  //   }
  // }, [user, setProfileValue, setAddressValue, setNotificationValue]); // Dependencies for this effect

  const onPasswordSubmit = (data: PasswordChangeForm) => {
    if (data.newPassword !== data.confirmPassword) {
      alert('Passwords do not match'); // Consider a custom modal/toast instead of alert
      return;
    }
    console.log('Password change:', data);
    resetPassword();
    alert('Password changed successfully'); // Consider a custom modal/toast
    // In a real app, dispatch an action to update password via API
  };

  const onProfileSubmit = (data: ProfileForm) => {
    console.log('Profile update:', data);
    alert('Profile updated successfully'); // Consider a custom modal/toast
    // In a real app, dispatch an action to update profile via API
  };

  const onAddressSubmit = (data: AddressForm) => {
    console.log('Address update:', data);
    alert('Addresses updated successfully'); // Consider a custom modal/toast
    // In a real app, dispatch an action to update addresses via API
  };

  const onNotificationsSubmit = (data: NotificationForm) => {
    console.log('Notifications update:', data);
    alert('Notification preferences updated successfully'); // Consider a custom modal/toast
    // In a real app, dispatch an action to update notification preferences via API
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
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
                      {...registerProfile('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...registerProfile('email', { required: 'Email is required' })}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
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
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Saved Addresses</h3>
              <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      {...registerAddress('homeAddress')}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your home address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      {...registerAddress('workAddress')}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your work address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      {...registerAddress('otherAddress')}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter another frequently used address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Addresses</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <form onSubmit={handleNotificationsSubmit(onNotificationsSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Notification Channels</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-900">Email Notifications</label>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input
                      {...registerNotifications('emailNotifications')}
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-900">SMS Notifications</label>
                      <p className="text-sm text-gray-600">Receive updates via text message</p>
                    </div>
                    <input
                      {...registerNotifications('smsNotifications')}
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-900">Push Notifications</label>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <input
                      {...registerNotifications('pushNotifications')}
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Notification Types</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-900">Order Updates</label>
                      <p className="text-sm text-gray-600">Status changes, delivery updates</p>
                    </div>
                    <input
                      {...registerNotifications('orderUpdates')}
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-900">Promotions & Offers</label>
                      <p className="text-sm text-gray-600">Special deals and discounts</p>
                    </div>
                    <input
                      {...registerNotifications('promotions')}
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Preferences</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'payment' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <CreditCard className="h-5 w-5 text-blue-400 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Payment Integration</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Payment methods will be integrated with Stripe, Paystack, or Flutterwave.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Saved Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
                          <p className="text-sm text-gray-600">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                    </div>
                  </div>
                  <button className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">
                    Add Payment Method
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Wallet Balance</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">25.50</p>
                      <p className="text-sm text-gray-600">Available balance</p>
                    </div>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">
                      Add Funds
                    </button>
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

export default CustomerSettings;