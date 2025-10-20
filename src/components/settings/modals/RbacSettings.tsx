// import React, { useState } from 'react';
// import { Shield, Plus, Lock, CheckCircle } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { Role, Permission } from '../../types'; // Assuming Role and Permission types are defined here

// interface CreateRoleForm {
//   name: string;
//   description: string;
//   permissions: string[];
// }

// interface RbacSettingsProps {
//   systemRoles: Role[];
//   availablePermissions: Permission[];
//   onRoleSubmit: (data: CreateRoleForm) => void;
// }

// const RbacSettings: React.FC<RbacSettingsProps> = ({ systemRoles, availablePermissions, onRoleSubmit }) => {
//   const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);
//   const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateRoleForm>();

//   const groupPermissionsByCategory = (permissions: Permission[]) => {
//     return permissions.reduce((acc, permission) => {
//       if (!acc[permission.category]) {
//         acc[permission.category] = [];
//       }
//       acc[permission.category].push(permission);
//       return acc;
//     }, {} as Record<string, Permission[]>);
//   };

//   const permissionsByCategory = groupPermissionsByCategory(availablePermissions);

//   const onSubmit = (data: CreateRoleForm) => {
//     onRoleSubmit(data);
//     reset();
//     setShowCreateRoleForm(false);
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-900">Role & Permissions Management</h3>
//         <button
//           onClick={() => setShowCreateRoleForm(true)}
//           className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
//         >
//           Create Custom Role
//         </button>
//       </div>

//       <div className="space-y-6">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <div className="flex">
//             <Shield className="h-5 w-5 text-yellow-400 mr-2" />
//             <div>
//               <h4 className="text-sm font-medium text-yellow-800">Role Management</h4>
//               <p className="text-sm text-yellow-700 mt-1">
//                 Create custom roles and assign granular permissions. Changes take effect immediately.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* System Roles */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h4 className="font-semibold text-gray-900 mb-4">System Roles</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {systemRoles.map((role) => (
//               <div key={role.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Shield className="h-5 w-5 text-blue-600" />
//                   <h5 className="font-medium text-gray-900">{role.name}</h5>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-3">{role.description}</p>
//                 <div className="text-xs text-gray-500">
//                   {role.permissions.length} permissions
//                 </div>
//                 <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
//                   View Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Permission Categories */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h4 className="font-semibold text-gray-900 mb-4">Available Permissions</h4>
//           <div className="space-y-6">
//             {Object.entries(permissionsByCategory).map(([category, permissions]) => (
//               <div key={category}>
//                 <h5 className="font-medium text-gray-900 mb-3 capitalize">{category} Permissions</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {permissions.map((permission) => (
//                     <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
//                       <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{permission.name}</p>
//                         <p className="text-xs text-gray-600">{permission.description}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Role Changes (omitted for brevity, could be a separate component) */}
//       </div>

//       {/* Create Role Modal */}
//       {showCreateRoleForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h4 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Role</h4>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
//                   <input
//                     {...register('name', { required: 'Role name is required' })}
//                     type="text"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="e.g., Operations Manager"
//                   />
//                   {errors.name && (
//                     <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                   <input
//                     {...register('description', { required: 'Description is required' })}
//                     type="text"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="Brief description of the role"
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h5 className="font-medium text-gray-900 mb-4">Select Permissions</h5>
//                 <div className="space-y-4">
//                   {Object.entries(permissionsByCategory).map(([category, permissions]) => (
//                     <div key={category} className="border border-gray-200 rounded-lg p-4">
//                       <h6 className="font-medium text-gray-900 mb-3 capitalize">{category}</h6>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                         {permissions.map((permission) => (
//                           <label key={permission.id} className="flex items-center space-x-2">
//                             <input
//                               {...register('permissions')}
//                               type="checkbox"
//                               value={permission.id}
//                               className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
//                             />
//                             <div>
//                               <span className="text-sm font-medium text-gray-900">{permission.name}</span>
//                               <p className="text-xs text-gray-600">{permission.description}</p>
//                             </div>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="submit"
//                   className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700"
//                 >
//                   Create Role
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateRoleForm(false)}
//                   className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RbacSettings;