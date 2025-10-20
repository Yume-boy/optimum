'use client'
import React from 'react';
import logo from '../../Images/logo.jpg';
import { useRouter } from 'next/navigation';




const page = () => {

 const router = useRouter()

  const goTo = (page:string) => {
    router.push(page)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <div className="h-16 rounded-full flex items-center justify-center">
              {/* <img src={logo} alt="Company Logo" className='h-14 rounded-full object-cover'/> */}
            </div>
        <h2 className="text-3xl  text-gray-900 mb-6 font-light">Welcome to Optimum Logistics</h2>
        <p className="text-gray-600 mb-8 font-light">Please select your role to proceed to login:</p>
        <div className="space-y-4">
          <button
            onClick={()=> goTo('/login/customer')}
            className="w-full bg-blue-600 font-light text-white py-3 rounded-lg  hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            I am a Customer
          </button>
          <button
            onClick={()=> goTo('/login/driver')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-light hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            I am a Driver
          </button>
          <button
            onClick={()=> goTo('/login/staff')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-light hover:bg-purple-700 transition-colors duration-200 shadow-md"
          >
            I am Staff / Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
