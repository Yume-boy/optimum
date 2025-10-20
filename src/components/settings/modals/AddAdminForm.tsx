import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateResourceMutation } from '@/redux/api/crudApi';

interface NewStaffForm {
  fullname: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  password_confirmation: string
}

interface AddAdminFormProps {
  // systemRoles: { id: string; name: string }[];
  // onSave: (data: NewStaffForm) => void; // <-- now includes password_confirmation
  onCancel: () => void;
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({  onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, getValues } = useForm<NewStaffForm>();
  const [staffData, {isLoading}] = useCreateResourceMutation()

  const password = watch('password'); // Watch password field for validation

  const onSubmit = async (data: NewStaffForm) => {
    if (data.password !== data.password_confirmation) {
      alert('Password and password confirmation do not match.');
      return;
    }

    try {
      await staffData({
        url: '/add/admin',
        data: data
      }).unwrap()
      alert('Staff added successfully')
    } catch (err) {
      alert('error, something went wrong')
    }

    


    
    // Destructure data to exclude password_confirmation before passing to parent
    // const { password_confirmation, ...staffData } = data;
    // onSave(data); // Pass data without confirmation field
    reset(); // Reset form fields
  };

  return (
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

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
        <select
          {...register('role', { required: 'Role is required' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select a role</option>
          {systemRoles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div> */}

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
            validate: value => value === password || 'Passwords do not match',
          })}
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {errors.password_confirmation && (
          <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
        )}
      </div>

      <div className="md:col-span-2 flex space-x-4 mt-4">
        <button
          type="submit"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700"
        >
          Add Admin
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddAdminForm;