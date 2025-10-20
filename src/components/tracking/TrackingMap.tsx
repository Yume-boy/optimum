import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Package, Clock } from 'lucide-react';

interface TrackingMapProps {
  orderId: string;
}

const TrackingMap = () => {
  const [driverLocation, setDriverLocation] = useState({
    lat: 40.7128,
    lng: -74.0060
  });

  const [orderStatus, setOrderStatus] = useState({
    status: 'in_transit',
    estimatedArrival: '15 min',
    driverName: 'John Doe',
    driverPhone: '+1 (555) 123-4567'
  });

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const trackingSteps = [
    { status: 'Order Placed', completed: true, time: '10:30 AM' },
    { status: 'Order Confirmed', completed: true, time: '10:35 AM' },
    { status: 'Driver Assigned', completed: true, time: '10:40 AM' },
    { status: 'Package Picked Up', completed: true, time: '11:15 AM' },
    { status: 'In Transit', completed: false, time: 'Now' },
    { status: 'Delivered', completed: false, time: 'ETA: 12:30 PM' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Track Order #1</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-600">Live Tracking</span>
        </div>
      </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
              <div className="text-center z-10">
                <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">Real-time driver location</p>
                </div>

              {/* Driver Location Marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute -top-8 -left-8 w-8 h-8 bg-emerald-500 rounded-full opacity-30 animate-ping"></div>
                  </div>
                </div>
              </div>

          {/* Order Info */}
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">Order Status</span>
                  </div>
              <p className="text-emerald-700 font-semibold capitalize">
                {orderStatus.status.replace('_', ' ')}
              </p>
                </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">ETA</span>
                  </div>
              <p className="text-blue-700 font-semibold">
                {orderStatus.estimatedArrival}
              </p>
                </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Navigation className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Driver</span>
                    </div>
              <p className="text-gray-700 font-semibold">
                {orderStatus.driverName}
              </p>
              <p className="text-sm text-gray-600">
                {orderStatus.driverPhone}
              </p>
              <button className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300">
                Call Driver
              </button>
                  </div>
                </div>
              </div>
              </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
        <div className="space-y-4">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${
                step.completed ? 'bg-emerald-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1">
                <p className={`font-medium ${
                  step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.status}
                </p>
                <p className="text-sm text-gray-500">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;