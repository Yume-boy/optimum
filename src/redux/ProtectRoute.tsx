// src/components/ProtectedRoute.tsx
'use client'

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState, ReactNode } from "react";

// This component wraps pages that require authentication.
// It checks for a token and redirects to the login page if not found.


type ProtectedRouteProps = {
  children: ReactNode;
};


function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function will run after the component has mounted on the client
    const checkAuth = () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        // If there's no token and we are NOT on the login page, redirect.
        if (pathname !== '/login/staff' && pathname !== '/login/customer' && pathname !== '/login/driver' && pathname !== '/staff/dashboard' && pathname !== '/signUp' && pathname !== '/' && pathname !== '/changePassword') {
          router.back();
        } else {
          setLoading(false);
          // If we're already on the login page and there's no token, we're done loading.
        }
      }
       else {
        // If a token exists, set loading to false to render the children
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router, pathname]); // The effect depends on the router and current pathname

  // While the authentication check is in progress, show a custom spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#013328] rounded-full animate-spin"></div>
      </div>
    );
  }

  // If we've passed the check and loading is false, render the protected content
  return <>{children}</>;
}

export default ProtectedRoute;
