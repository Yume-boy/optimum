'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSignupMutation} from '@/redux/api/authApi';
import { useRouter } from 'next/navigation';
// import logo from '../../Images/logo.jpg';

type SuperAdminData = {
  email: string;
  fullname: string;
  password: string;
  password_confirmation: string;
};

interface SuperAdminProps {
  onSuccess: () => void;
  click: () => void;
  back: ()=> void
}


const SuperAdmin= () => {

  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signup, {isLoading , isError}] = useSignupMutation()

  const router = useRouter()
    
      const goTo = (page:string) => {
        router.push(page)
      }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SuperAdminData>();

  const password = watch('password');

  const onSubmit: SubmitHandler<SuperAdminData> = async (data) => {
    try {
       const response = await signup({
            credentials: data, 
            url: '/register/superadmin'
        }).unwrap()
        alert('Superadmin added successfully')
        router.refresh()
    } catch (error) {
      console.error('Login dispatch error:', error);
      alert('An unexpected error occurred during login.'); // Using alert for demo
    }
  };

  return (
    <div className='flex items-center justify-center px-4 font-sans'>
      <div className="max-w-md w-full space-y-8 px-8 py-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex mb-2">
            <div className="h-14 rounded-full flex items-center justify-center">
              {/* <img src={logo} alt="Company Logo" className='h-14 rounded-full object-cover'/> */}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-left">Add Superadmin</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-4"
        >
          {/* Fullname Field */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Fullname (Firstname first)
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('fullname', { required: 'Fullname is required' })}
                placeholder="Enter your fullname"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#491DF1] focus:ring-1 focus:ring-[#491DF1] shadow-md transition-all duration-200 ease-in-out"
              />
            </div>
            {errors.fullname && (
              <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#491DF1] focus:ring-1 focus:ring-[#491DF1] shadow-md transition-all duration-200 ease-in-out"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                placeholder="Create your password"
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#491DF1] focus:ring-1 focus:ring-[#491DF1] shadow-md transition-all duration-200 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('password_confirmation', {
                  required: 'Password confirmation is required',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#491DF1] focus:ring-1 focus:ring-[#491DF1] shadow-md transition-all duration-200 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Error message from backend */}
          <p className="text-center text-green-400 text-sm">{success}</p>
          {isError && <p className="text-center text-red-600 text-sm">{'Error Signing Up'}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#491DF1] text-white rounded-lg font-medium hover:bg-[#3a18c0] focus:outline-none focus:ring-2 focus:ring-[#491DF1] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Creating account...' : 'Add'}
          </button>
        </form>

         
      </div>
    </div>
  );
};

export default SuperAdmin;