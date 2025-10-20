'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'; 
import { useLoginMutation } from '@/redux/api/authApi';
import { useRouter } from 'next/navigation';


// Define the valid roles and the form data structure
type UserRole = 'staff' | 'admin' | 'superadmin';

interface LoginFormData {
  email: string;
  password: string;
}

// Define the endpoint mapping for clarity
const roleEndpoints: Record<UserRole, string> = {
    staff: '/login/staff',
    admin: '/login/admin',
    superadmin: '/login/superadmin',
};

// Define the initial role-based redirect path
const roleRedirects: Record<UserRole, string> = {
    staff: '/staff/dashboard',
    admin: '/admin/dashboard',
    superadmin: '/superadmin/dashboard',
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  // State to track the selected role, defaulting to staff
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff'); 
  const [login, {isLoading , isError:loginError}] = useLoginMutation()

  const router = useRouter()
  
  const goTo = (page:string) => {
    router.push(page)
  }
  

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    // 1. Get the correct endpoint based on the selected role
    const loginUrl = roleEndpoints[selectedRole];

    try {
        const response = await login({
            credentials: data, 
            // 2. Pass the dynamic URL to the mutation
            url: loginUrl 
        }).unwrap()

        console.log(response)
        sessionStorage.setItem('user', response?.message.fullname)
        sessionStorage.setItem('email', response?.message.email)
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('role', response.role)
        sessionStorage.setItem('phone', response?.message.phone)
        sessionStorage.setItem('user_id', response?.message.id)
        
        // 3. Redirect to the correct dashboard based on the selected role
        goTo('/staff/dashboard')

    } catch (error) {
      console.error('Login dispatch error:', error);
      // It's better to show the specific error from the backend if available
      alert('Login failed. Please check your credentials and selected role.'); 
    }
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex items-center justify-center p-4 font-sans">
      <div className=" relative max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
      <div className='flex gap-2 items-center '><ArrowLeft className='absolute top-5 left-2'/></div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 rounded-full flex items-center justify-center">
              {/* <img src={logo} alt="Company Logo" className='h-14 rounded-full object-cover'/> */}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          {/* 🔑 CREATIVE ADDITION: Role Selection Radio Buttons 🔑 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Login As</label>
            <div className="flex gap-6">
              {Object.keys(roleEndpoints).map((role) => (
                <label key={role} className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="roleSelection"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role as UserRole)}
                    className="form-radio text-[#491DF1] h-4 w-4 transition-colors duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700 font-medium capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>
          {/* -------------------------------------------------------- */}


          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#491DF1] focus:ring-1 focus:ring-[#491DF1] shadow-md transition-all duration-200 ease-in-out"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> 
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#491DF1] text-white rounded-lg font-medium hover:bg-[#3a18c0] focus:outline-none focus:ring-2 focus:ring-[#491DF1] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {loginError && ( // Display Redux error message
            <p className="mt-2 text-sm text-red-600 text-center">{loginError}</p>
          )}

          <div className='text-center text-gray-700'> 
            Don’t have an account? {' '}
            <button
              type="button" 
              className="text-[#491DF1] hover:underline font-medium" 
              onClick={()=> goTo('/signup/customer')}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;