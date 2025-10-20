// import React, { useState } from 'react';
// import { Key, Eye, EyeOff, Save } from 'lucide-react';
// import { useForm } from 'react-hook-form';

// interface PasswordChangeForm {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// interface SecuritySettingsProps {
//   onPasswordSubmit: (data: PasswordChangeForm) => void;
// }

// const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onPasswordSubmit }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordChangeForm>();

//   const onSubmit = (data: PasswordChangeForm) => {
//     if (data.newPassword !== data.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }
//     onPasswordSubmit(data);
//     reset();
//   };

//   return (
//     <div className="max-w-2xl">
//       <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Current Password
//           </label>
//           <div className="relative">
//             <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               {...register('currentPassword', { required: 'Current password is required' })}
//               type="password"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             />
//           </div>
//           {errors.currentPassword && (
//             <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             New Password
//           </label>
//           <div className="relative">
//             <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               {...register('newPassword', { 
//                 required: 'New password is required',
//                 minLength: { value: 8, message: 'Password must be at least 8 characters' }
//               })}
//               type={showPassword ? 'text' : 'password'}
//               className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//             </button>
//           </div>
//           {errors.newPassword && (
//             <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Confirm New Password
//           </label>
//           <div className="relative">
//             <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               {...register('confirmPassword', { required: 'Please confirm your password' })}
//               type="password"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             />
//           </div>
//           {errors.confirmPassword && (
//             <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
//         >
//           <Save className="h-5 w-5" />
//           <span>Update Password</span>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SecuritySettings;