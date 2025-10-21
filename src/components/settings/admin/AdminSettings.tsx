import React, { useState } from 'react';

import { User, Shield, Truck, Settings as SettingsIcon, Key, Mail, Phone, Save, Plus, Edit, Trash2, Eye, EyeOff, Users, Lock, CheckCircle, XCircle } from 'lucide-react';

import { useForm } from 'react-hook-form';

import

{ useFetchResourceQuery,

  useCreateResourceMutation,

  useEditResourceMutation,

  usePatchResourceMutation,

  useDeleteResourceMutation }

from '@/redux/api/crudApi';

import Modal from '../modals/Modal';

import AddStaffForm from '../modals/AddStaffForm';
import AddAdminForm from '../modals/AddAdminForm';





interface PasswordChangeForm {

  password: string;

  password_confirmation: string

  current_password: string;

}



interface ProfileForm {

  fullname: string;

  email: string;

  phone: string;

}



interface NewDriverForm {

  fullname: string;

  email: string;

  phone: string;

  vehicle_type: string;

  vehicle_no: string;

  license_no: string;

  password: string;

  password_confirmation: string;

  home_address: string,

  work_address: string,

}



interface UserRoleForm {

  userId: string;

  roleId: string;

}



interface CreateRoleForm {

  name: string;

  description: string;

  permissions: string[];

}



const AdminSettings: React.FC = () => {

  const [activeTab, setActiveTab] = useState('profile');

  const [showPassword, setShowPassword] = useState(false);

  const [showNewDriverForm, setShowNewDriverForm] = useState(false);

  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [showAddStaffForm, setShowAddStaffForm] = useState(false);



  //Get endpoints

  const {data: driverData, isLoading: driverLoading, isError: driverError} = useFetchResourceQuery('/all/drivers')

  const {data: staffData, isLoading: staffLoading, isError: staffError} = useFetchResourceQuery('/all/staff')
  const {data: adminData, isLoading: adminLoading, isError: adminError} = useFetchResourceQuery('/all/admin')



  //Post endpoints

  const [createDriver, {isLoading:createDriverLoading }] = useCreateResourceMutation()

  const [createProfile, {isLoading:createProfileLoading }] = usePatchResourceMutation()

  const [createPassword, {isLoading:createPasswordLoading }] = usePatchResourceMutation()



    const email = sessionStorage.getItem('email')

    const phone = sessionStorage.getItem('phone')

    const name = sessionStorage.getItem('user')



  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordChangeForm>();

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileForm>({

    defaultValues: {

      fullname: name || '',

      // email: email || '',

      phone: phone || '',

    }

  });

  const { register: registerDriver, handleSubmit: handleDriverSubmit, formState: { errors: driverErrors }, reset: resetDriver } = useForm<NewDriverForm>();

  const { register: registerRole, handleSubmit: handleRoleSubmit, formState: { errors: roleErrors }, reset: resetRole } = useForm<CreateRoleForm>();

  const { register: registerUserRole, handleSubmit: handleUserRoleSubmit } = useForm<UserRoleForm>();



  // Mock data - in real app this would come from API







  const onPasswordSubmit = async (data: PasswordChangeForm) => {

    console.log('Password change:', data);

    try {

      await createPassword({

        data: data,

        url: '/superadmin/settings/password'

      }).unwrap()

      // resetPassword();

    } catch(err) {

      console.log('error changing password')

    }

  };



  const onProfileSubmit = async (data: ProfileForm) => {

    console.log('Profile update:', data);



    try {

      await createProfile({

        data: data,

        url: '/superadmin/settings/profile'

      }).unwrap()

      alert('Profile updated successfully');

    } catch(err) {

      console.log('error creating profile')

    }



  };



  const onDriverSubmit = async (data: NewDriverForm) => {



    try{

      await createDriver({

        data: data,

        url: '/add/driver'

      }).unwrap()

      resetDriver();

      console.log('New driver:', data);

      setShowNewDriverForm(false);

      alert('Driver added successfully');

    } catch (err) {

      console.log('Error creating driver')

    }



  };



  const onRoleSubmit = (data: CreateRoleForm) => {

    console.log('New role:', data);

    resetRole();

    setShowCreateRoleForm(false);

    alert('Role created successfully');

  };



  const onUserRoleSubmit = (data: UserRoleForm) => {

    console.log('User role assignment:', data);

    alert('User role updated successfully');

  };



  const handleDeleteDriver = (driverId: string) => {

    if (confirm('Are you sure you want to delete this driver?')) {

      console.log('Delete driver:', driverId);

      alert('Driver deleted successfully');

    }

  };



  const handleToggleDriverStatus = (driverId: string, isActive: boolean) => {

    console.log('Toggle driver status:', driverId, !isActive);

    alert(`Driver ${!isActive ? 'activated' : 'deactivated'} successfully`);

  };









  const tabs = [

    { id: 'profile', label: 'Profile Settings', icon: User },

    { id: 'security', label: 'Security', icon: Shield },

    { id: 'drivers', label: 'Driver Management', icon: Truck },

    { id: 'users', label: 'Staff Management', icon: Users },

    { id: 'admin', label: 'Admin Management', icon: Users },

  ];



  return (

    <div className="max-w-4xl mx-auto space-y-6">

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        <div className="border-b border-gray-200">

          <nav className="hidden md:flex  space-x-8 px-6">

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

                      {...registerProfile('fullname', { required: 'Fullname is required' })}

                      type="text"

                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                    />

                  </div>

                  {profileErrors.fullname && (

                    <p className="mt-1 text-sm text-red-600">{profileErrors.fullname.message}</p>

                  )}

                </div>



                {/* <div>

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

                </div> */}



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

                      {...registerPassword('current_password', { required: 'Current password is required' })}

                      type="password"

                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                    />

                  </div>

                  {passwordErrors.current_password && (

                    <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>

                  )}

                </div>



                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    New Password

                  </label>

                  <div className="relative">

                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                    <input

                      {...registerPassword('password', {

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

                  {passwordErrors.password && (

                    <p className="mt-1 text-sm text-red-600">{passwordErrors.password.message}</p>

                  )}

                </div>



                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Confirm New Password

                  </label>

                  <div className="relative">

                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                    <input

                      {...registerPassword('password_confirmation', { required: 'Please confirm your password' })}

                      type="password"

                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                    />

                  </div>

                  {passwordErrors.password_confirmation && (

                    <p className="mt-1 text-sm text-red-600">{passwordErrors.password_confirmation.message}</p>

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



          {activeTab === 'drivers' && (

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

                  <form onSubmit={handleDriverSubmit(onDriverSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>

                      <input

                        {...registerDriver('fullname', { required: 'Name is required' })}

                        type="text"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.fullname && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.fullname.message}</p>

                      )}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>

                      <input

                        {...registerDriver('email', { required: 'Email is required' })}

                        type="email"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.email && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.email.message}</p>

                      )}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>

                      <input

                        {...registerDriver('phone', { required: 'Phone is required' })}

                        type="tel"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.phone && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.phone.message}</p>

                      )}

                    </div>

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>

                      <input

                        {...registerDriver('home_address', { required: 'Home address is required' })}

                        type="text"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.home_address && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.home_address.message}</p>

                      )}

                    </div>

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Work Address</label>

                      <input

                        {...registerDriver('work_address', { required: 'work address is required' })}

                        type="text"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.work_address && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.work_address.message}</p>

                      )}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>

                      <select

                        {...registerDriver('vehicle_type', { required: 'Vehicle type is required' })}

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      >

                        <option value="">Select vehicle type</option>

                        <option value="motorcycle">Motorcycle</option>

                        <option value="car">Car</option>

                        <option value="van">Van</option>

                        <option value="truck">Truck</option>

                      </select>

                      {driverErrors.vehicle_type && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.vehicle_type.message}</p>

                      )}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>

                      <input

                        {...registerDriver('vehicle_no', { required: 'Vehicle number is required' })}

                        type="text"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.vehicle_no && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.vehicle_no.message}</p>

                      )}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>

                      <input

                        {...registerDriver('license_no', { required: 'License number is required' })}

                        type="text"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.license_no && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.license_no.message}</p>

                      )}

                    </div>



                    <div className="md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>

                      <input

                        {...registerDriver('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}

                        type="password"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.password && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.password.message}</p>

                      )}

                    </div>

                    <div className="md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 mb-2">Password confirmation</label>

                      <input

                        {...registerDriver('password_confirmation', { required: 'Password confirmation is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}

                        type="password"

                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                      />

                      {driverErrors.password_confirmation && (

                        <p className="mt-1 text-sm text-red-600">{driverErrors.password_confirmation.message}</p>

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



              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">phone No</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>

                    </tr>

                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {driverData?.drivers?.data?.map((driver:any) => (

                      <tr key={driver.id}>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div>

                            <div className="text-sm font-medium text-gray-900">Driver {driver.fullname}</div>

                            <div className="text-sm text-gray-500">License: {driver.license_no}</div>

                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="text-sm text-gray-900">{driver.vehicle_type}</div>

                          <div className="text-sm text-gray-500">{driver.vehicle_no}</div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                         <div className="text-sm text-gray-500">{driver.email}</div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                          {driver.phone}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">

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

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}



          {activeTab === 'users' && (

            <div>

              <div className="flex items-center justify-between mb-6">

                <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>

                <button

                onClick={() => setShowAddStaffForm(true)}

                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">

                  Add Staff

                </button>

              </div>

               {/* Add Staff Modal */}

                    <Modal

                      isOpen={showAddStaffForm}

                      onClose={() => setShowAddStaffForm(false)}

                      title="Add New Staff Member"

                    >

                      <AddStaffForm

                        // systemRoles={systemRoles}

                        // onSave={handleAddStaff}

                        onCancel={() => setShowAddStaffForm(false)}

                      />

                    </Modal>



              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>

                    </tr>

                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {staffData?.staff?.data?.map((user:any) => (

                      <tr key={user.id}>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="flex items-center">

                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">

                              <User className="h-5 w-5 text-gray-600" />

                            </div>

                            <div className="ml-4">

                              <div className="text-sm font-medium text-gray-900">{user.fullname}</div>

                              <div className="text-sm text-gray-500">{user.email}</div>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                            {user.role}

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                          {user.phone}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                          <div className="flex space-x-2">                          

                            <button className="text-blue-600 hover:text-blue-900">

                               <Edit className="h-4 w-4" />

                            </button>

                            <button className="text-red-600 hover:text-red-900">

                             <Trash2 className="h-4 w-4" />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            </div>

          )}
          {activeTab === 'admin' && (

            <div>

              <div className="flex items-center justify-between mb-6">

                <h3 className="text-lg font-semibold text-gray-900">Admin Management</h3>

                <button

                onClick={() => setShowAddStaffForm(true)}

                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">

                  Add Admin

                </button>

              </div>

               {/* Add Staff Modal */}

                    <Modal

                      isOpen={showAddStaffForm}

                      onClose={() => setShowAddStaffForm(false)}

                      title="Add New Admin"

                    >

                      <AddAdminForm

                        // systemRoles={systemRoles}

                        // onSave={handleAddStaff}

                        onCancel={() => setShowAddStaffForm(false)}

                      />

                    </Modal>



              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>

                    </tr>

                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {adminData?.admin?.data?.map((user:any) => (

                      <tr key={user.id}>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="flex items-center">

                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">

                              <User className="h-5 w-5 text-gray-600" />

                            </div>

                            <div className="ml-4">

                              <div className="text-sm font-medium text-gray-900">{user.fullname}</div>

                              <div className="text-sm text-gray-500">{user.email}</div>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                            {user.role}

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                          {user.phone}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                          <div className="flex space-x-2">                          

                            <button className="text-blue-600 hover:text-blue-900">

                               <Edit className="h-4 w-4" />

                            </button>

                            <button className="text-red-600 hover:text-red-900">

                             <Trash2 className="h-4 w-4" />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            </div>

          )}





        </div>

      </div>



  );

};



export default AdminSettings;