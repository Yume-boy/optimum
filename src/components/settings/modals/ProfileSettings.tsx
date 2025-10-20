import React, { useEffect } from 'react';
import { User, Mail, Phone, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../Auth/store'; // Adjust path as per your project structure
// Assuming 'User' type is from your authSlice or a shared types file
import { User as AuthUser } from '../../Auth/slices/staffAuthSlice'; // Adjust path to your authSlice

interface ProfileFormProps {
  // Removed 'user' prop as it will be fetched internally from Redux
  onProfileSubmit: (data: { name: string; email: string; phone: string | null }) => void;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string | null; // Allow phone to be null
}

const ProfileSettings: React.FC<ProfileFormProps> = ({ onProfileSubmit }) => {
  // Fetch the logged-in user data from the Redux auth slice
  // Assuming your auth slice stores the user object under state.auth.user
  const user: AuthUser | null = useSelector((state: RootState) => state.staffAuth.user);

  // Initialize react-hook-form with default values from the Redux user state
  // This ensures the form is pre-filled with the current user's information
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      // Map 'fullname' from API to 'name' for the form, and handle potential nulls
      name: user?.name || '', 
      email: user?.email || '',
      phone: user?.phone || null,
    }
  });

  // Use useEffect to reset the form values if the user data changes (e.g., after login/logout)
  useEffect(() => {
    reset({
      name: user?.fullname || '',
      email: user?.email || '',
      phone: user?.phone || null,
    });
  }, [user, reset]); // Depend on 'user' and 'reset' function

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
      <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              id="fullName"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
              type="email"
              id="emailAddress"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('phone')}
              type="tel"
              id="phoneNumber"
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
  );
};

export default ProfileSettings;
