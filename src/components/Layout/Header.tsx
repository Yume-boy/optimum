'use client'
import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface HeaderProps {
  user: any
}

const Header= ({ toggleSidebar }: { toggleSidebar: () => void }) => {

  const router = useRouter()

  const name = sessionStorage.getItem('user')
  const email = sessionStorage.getItem('email')
  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
    
  };

  console.log(name, email)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            // onClick={onToggleSidebar}
            className=" p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5 text-gray-600" onClick={toggleSidebar}/>
          </button>
          {/* Using a placeholder for the logo for Canvas compatibility */}
           {/* <img src={logo} alt="company logo"  className=' h-14'/> */}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5 text-gray-600" />
              { 1 > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {1}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                {/* Display active user's email or name from Redux state */}
                <p className="text-sm font-medium text-gray-900">{email || 'Guest'}</p>
                {/* Display active user's role */}
                <p className="text-xs text-gray-500 capitalize">{name|| 'N/A'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout} // Call the Redux logout handler
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
