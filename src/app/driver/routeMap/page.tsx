'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import TrackingMap from '@/components/tracking/TrackingMap'

const Page = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarHidden(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (fixed) */}
      <div
        className={`${
          isSidebarHidden ? 'hidden' : 'block'
        }  fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarHidden ? 'ml-0' : 'md:ml-64'
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 py-6 px-3 overflow-y-auto">
          <TrackingMap />
        </main>
      </div>
    </div>
  )
}

export default Page
