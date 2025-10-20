// import React, { useState } from 'react';
// import { User, Shield, Truck, Settings as SettingsIcon, Key, Mail, Phone, Save, Plus, Edit, Trash2, Eye, EyeOff, Users, Lock, CheckCircle, XCircle } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// // Assuming useAuth and useApp exist in your project structure
// // import { useAuth } from './contexts/AuthContext';
// // import { useApp } from './contexts/AppContext';
// // import { useDispatch, useSelector } from 'react-redux';
// // The addDriver import is now used directly in DriverManagement, but still good to reference slice path here if needed for other Redux interactions.
// // import { addDriver } from '../../Auth/slices/driverSlice';
// // import type { AppDispatch, RootState } from '../../Auth/store'; // Adjust path for your store

// // Import the new components
// import ProfileSettings from './ProfileSettings';
// import SecuritySettings from './SecuritySettings';
// import DriverManagement from './DriverManagement';
// import UserManagement from './UserManagement';
// import RbacSettings from './RbacSettings';

// // Assume these types and mock data are defined elsewhere
// interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface Driver {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   licenseNumber: string;
//   isAvailable: boolean;
//   rating: number;
//   totalDeliveries: number;
// }

// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   permissions: string[];
//   isSystem?: boolean; // Added for mock data consistency
//   createdAt?: Date; // Added for mock data consistency
// }

// interface Permission {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
// }

// // Mock Data (Keeping this here for AdminSettings to manage overall state,
// // or for passing to components that need full lists like UserManagement and RbacSettings)
// const mockUser: AuthUser = {
//   id: '1',
//   name: 'John Doe',
//   email: 'john.doe@example.com',
//   phone: '555-1234',
// };

// const mockDrivers: Driver[] = [
//   { id: '1', name: 'Alice Smith', email: 'alice@example.com', phone: '111', vehicleType: 'Car', vehicleNumber: 'ABC 123', licenseNumber: 'D-12345', isAvailable: true, rating: 4.5, totalDeliveries: 150 },
//   { id: '2', name: 'Bob Johnson', email: 'bob@example.com', phone: '222', vehicleType: 'Motorcycle', vehicleNumber: 'XYZ 789', licenseNumber: 'D-67890', isAvailable: false, rating: 4.8, totalDeliveries: 300 },
// ];

// const mockUsers = [
//   { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', role: 'Super Administrator', lastActive: '2 days ago' },
//   { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Administrator', lastActive: '1 day ago' },
//   { id: 'user-3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Operations Manager', lastActive: '5 hours ago' },
// ];

// const mockAvailablePermissions: Permission[] = [
//   // Orders
//   { id: 'orders.view', name: 'View Orders', description: 'View all orders and their details', category: 'orders' },
//   { id: 'orders.create', name: 'Create Orders', description: 'Create new orders', category: 'orders' },
//   { id: 'orders.edit', name: 'Edit Orders', description: 'Modify existing orders', category: 'orders' },
//   { id: 'orders.delete', name: 'Delete Orders', description: 'Delete orders', category: 'orders' },
//   { id: 'orders.assign', name: 'Assign Orders', description: 'Assign orders to drivers', category: 'orders' },
  
//   // Drivers
//   { id: 'drivers.view', name: 'View Drivers', description: 'View driver information', category: 'drivers' },
//   { id: 'drivers.create', name: 'Add Drivers', description: 'Add new drivers to the system', category: 'drivers' },
//   { id: 'drivers.edit', name: 'Edit Drivers', description: 'Modify driver information', category: 'drivers' },
//   { id: 'drivers.delete', name: 'Remove Drivers', description: 'Remove drivers from the system', category: 'drivers' },
//   { id: 'drivers.manage', name: 'Manage Drivers', description: 'Full driver management capabilities', category: 'drivers' },
  
//   // Customers
//   { id: 'customers.view', name: 'View Customers', description: 'View customer information', category: 'customers' },
//   { id: 'customers.create', name: 'Add Customers', description: 'Add new customers', category: 'customers' },
//   { id: 'customers.edit', name: 'Edit Customers', description: 'Modify customer information', category: 'customers' },
//   { id: 'customers.delete', name: 'Remove Customers', description: 'Remove customers', category: 'customers' },
  
//   // Reports
//   { id: 'reports.view', name: 'View Reports', description: 'Access reporting dashboard', category: 'reports' },
//   { id: 'reports.export', name: 'Export Reports', description: 'Export reports as CSV/PDF', category: 'reports' },
//   { id: 'reports.financial', name: 'Financial Reports', description: 'Access financial reporting', category: 'reports' },
//   { id: 'reports.analytics', name: 'Advanced Analytics', description: 'Access advanced analytics', category: 'reports' },
  
//   // Settings
//   { id: 'settings.view', name: 'View Settings', description: 'Access settings pages', category: 'settings' },
//   { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'settings' },
//   { id: 'settings.rbac', name: 'Role Management', description: 'Manage roles and permissions', category: 'settings' },
//   { id: 'settings.system', name: 'System Settings', description: 'Access system-level settings', category: 'settings' },
  
//   // System
//   { id: 'system.audit', name: 'Audit Logs', description: 'View system audit logs', category: 'system' },
//   { id: 'system.backup', name: 'System Backup', description: 'Perform system backups', category: 'system' },
//   { id: 'system.maintenance', name: 'System Maintenance', description: 'Perform system maintenance', category: 'system' },
// ];

// const mockSystemRoles: Role[] = [
//   {
//     id: 'super-admin',
//     name: 'Super Administrator',
//     description: 'Full system access with all permissions',
//     permissions: mockAvailablePermissions.map(p => p.id),
//     isSystem: true,
//     createdAt: new Date('2024-01-01'),
//   },
//   {
//     id: 'admin',
//     name: 'Administrator',
//     description: 'Standard admin with most permissions',
//     permissions: [
//       'orders.view', 'orders.create', 'orders.edit', 'orders.assign',
//       'drivers.view', 'drivers.create', 'drivers.edit', 'drivers.manage',
//       'customers.view', 'customers.edit',
//       'reports.view', 'reports.export',
//       'settings.view', 'settings.edit'
//     ],
//     isSystem: true,
//     createdAt: new Date('2024-01-01'),
//   },
//   {
//     id: 'manager',
//     name: 'Operations Manager',
//     description: 'Manages daily operations and staff',
//     permissions: [
//       'orders.view', 'orders.edit', 'orders.assign',
//       'drivers.view', 'drivers.manage',
//       'customers.view',
//       'reports.view'
//     ],
//     isSystem: true,
//     createdAt: new Date('2024-01-01'),
//   },
//   {
//     id: 'supervisor',
//     name: 'Supervisor',
//     description: 'Limited access for supervisory tasks',
//     permissions: [
//       'orders.view',
//       'drivers.view',
//       'customers.view',
//       'reports.view'
//     ],
//     isSystem: true,
//     createdAt: new Date('2024-01-01'),
//   },
// ];

// // Define interfaces for forms that are still managed by AdminSettings
// interface PasswordChangeForm {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// interface ProfileForm {
//   name: string;
//   email: string;
//   phone: string;
// }

// interface UserRoleForm {
//   userId: string;
//   roleId: string;
// }

// interface CreateRoleForm {
//   name: string;
//   description: string;
//   permissions: string[];
// }


// const AdminSettings1: React.FC = () => {
//   // const { user, hasPermission } = useAuth(); // Assuming useAuth provides `user`
//   const user = mockUser; // Using mock data for demonstration

//   // In a real app, `drivers` would be fetched from Redux store using useSelector
//   // const drivers = useSelector((state: RootState) => state.drivers.drivers);
//   const drivers = mockDrivers; // Using mock data for demonstration

//   const [activeTab, setActiveTab] = useState('profile');
//   const [showPassword, setShowPassword] = useState(false); // Still needed for SecuritySettings if not refactored further
//   const [showCreateRoleForm, setShowCreateRoleForm] = useState(false); // Still needed for RbacSettings if not refactored further
//   const [selectedUser, setSelectedUser] = useState<string | null>(null); // Still needed for UserManagement if not refactored further

//   // Form hooks for forms still managed directly in AdminSettings
//   const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordChangeForm>();
//   const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileForm>({
//     defaultValues: {
//       name: user?.name || '',
//       email: user?.email || '',
//       phone: user?.phone || '',
//     }
//   });
//   const { register: registerRole, handleSubmit: handleRoleSubmit, formState: { errors: roleErrors }, reset: resetRole } = useForm<CreateRoleForm>();
//   const { register: registerUserRole, handleSubmit: handleUserRoleSubmit } = useForm<UserRoleForm>();


//   // Handlers for the child components
//   const onProfileSubmit = (data: ProfileForm) => {
//     console.log('Profile update submitted:', data);
//     alert('Profile updated successfully!');
//   };

//   const onPasswordSubmit = (data: PasswordChangeForm) => {
//     if (data.newPassword !== data.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }
//     console.log('Password change submitted:', data);
//     resetPassword();
//     alert('Password updated successfully!');
//   };



//   const onUserRoleSubmit = (data: UserRoleForm) => {
//     console.log('Role assignment submitted:', data);
//     alert('Role assigned successfully!');
//     setSelectedUser(null); // Close modal after submission
//   };

//   const onRoleSubmit = (data: CreateRoleForm) => {
//     console.log('New role created:', data);
//     resetRole();
//     setShowCreateRoleForm(false);
//     alert('New role created successfully!');
//   };
  
//   const handleDeleteDriver = (driverId: string) => {
//     if (confirm('Are you sure you want to delete this driver?')) {
//       console.log('Deleting driver:', driverId);
//       // In a real app, you would dispatch a deleteDriver action here
//       alert('Driver deleted successfully');
//     }
//   };
  
//   const handleToggleDriverStatus = (driverId: string, isActive: boolean) => {
//     console.log(`Toggling driver ${driverId} status to ${!isActive}`);
//     // In a real app, you would dispatch an action to update driver status here
//     alert(`Driver with ID ${driverId} status changed.`);
//   };

//   // Helper function for permissions (can be moved to RbacSettings if not used elsewhere)
//   const groupPermissionsByCategory = (permissions: Permission[]) => {
//     return permissions.reduce((acc, permission) => {
//       if (!acc[permission.category]) {
//         acc[permission.category] = [];
//       }
//       acc[permission.category].push(permission);
//       return acc;
//     }, {} as Record<string, Permission[]>);
//   };
//   const permissionsByCategory = groupPermissionsByCategory(mockAvailablePermissions);


//   const tabs = [
//     { id: 'profile', label: 'Profile Settings', icon: User },
//     { id: 'security', label: 'Security', icon: Shield },
//     { id: 'drivers', label: 'Driver Management', icon: Truck },
//     { id: 'users', label: 'User Management', icon: Users },
//     { id: 'rbac', label: 'Role & Permissions', icon: Lock },
//   ];

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h2>
        
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Tab Navigation */}
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
//               {tabs.map((tab) => {
//                 const Icon = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
//                       activeTab === tab.id
//                         ? 'border-emerald-500 text-emerald-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <Icon className="h-5 w-5" />
//                     <span>{tab.label}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
          
//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'profile' && (
//               <ProfileSettings user={user} onProfileSubmit={onProfileSubmit} />
//             )}
//             {activeTab === 'security' && (
//               <SecuritySettings onPasswordSubmit={onPasswordSubmit} />
//             )}
//             {activeTab === 'drivers' && (
//               <DriverManagement
//                 drivers={drivers}
//                 handleDeleteDriver={handleDeleteDriver}
//                 handleToggleDriverStatus={handleToggleDriverStatus}
//               />
//             )}
//             {activeTab === 'users' && (
//               <UserManagement
//                 mockUsers={mockUsers}
//                 systemRoles={mockSystemRoles}
//                 onUserRoleSubmit={onUserRoleSubmit}
//                 selectedUser={selectedUser} // Pass selectedUser state
//                 setSelectedUser={setSelectedUser} // Pass setter for modal control
//               />
//             )}
//             {activeTab === 'rbac' && (
//               <RbacSettings
//                 systemRoles={mockSystemRoles}
//                 availablePermissions={mockAvailablePermissions}
//                 onRoleSubmit={onRoleSubmit}
//                 showCreateRoleForm={showCreateRoleForm} // Pass state for modal control
//                 setShowCreateRoleForm={setShowCreateRoleForm} // Pass setter for modal control
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSettings1;