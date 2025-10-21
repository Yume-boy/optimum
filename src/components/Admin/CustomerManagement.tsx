import React, { useState } from 'react';
import { Truck, User, Star, DollarSign, Package, MapPin, Phone, Mail, MoreVertical, Search, User2  } from 'lucide-react';
import { useFetchResourceQuery } from '@/redux/api/crudApi';

interface Driver {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  vehicle_type: string;
  vehicle_no: string;
  license_no: string;
  created_at: string;
  updated_at: string;
  role: string;
  isAvailable?: boolean;
  rating?: number;
  totalDeliveries?: number;
  earnings?: number;
}

const DriverManagement: React.FC = () => {
  const { data: drivers } = useFetchResourceQuery('all/drivers');
  const { data: customers, isLoading, isError } = useFetchResourceQuery('all/customers');
      const {data: dashBoard, isLoading: dashBoardLoading, isError: dashBoardError} = useFetchResourceQuery('/superadmin/dashboard')
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');



    const stats = dashBoard ? [
      {
        title: 'Total Orders',
        value: dashBoard.total_orders,
        change: '+12%', // Static for now, can be made dynamic
        icon: Package,
        color: 'bg-blue-500',
      },
      {
        title: 'Total Revenue',
        value: `₦${dashBoard.total_revenue?.toLocaleString()}`,
        change: '+25%',
        icon: DollarSign,
        color: 'bg-orange-500',
      },
      {
        title: 'Total Customers',
        value: `${customers?.customer.data.length}`,
        change: '+25%',
        icon: User2,
        color: 'bg-orange-500',
      },
    ] : [];

  

  // Filtering drivers
  const filteredDrivers = customers?.customer.data.filter((driver:any) =>
    driver.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selected = customers?.customer.data.find((driver:any) => driver.id === selectedDriver);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredDrivers?.length} customers found
          </div>
        </div>
      </div>

      {/* Driver cards and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredDrivers?.map((driver:any) => (
            <div
              key={driver.id}
              className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer ${
                selectedDriver === driver.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
              }`}
              onClick={() => setSelectedDriver(driver.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{driver.fullname}</h4>
                    
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{driver.email}</p>
                  <p className="text-sm text-gray-600">{driver.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Driver Details */}
        <div>
          {selected ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selected.fullname}</h4>
                    <p className="text-sm text-gray-600">Phone no: {selected.phone}</p>
                    {/* <p className="text-sm text-gray-600">License: {selected.license_no}</p> */}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoBox icon={<Phone className="h-4 w-4 text-emerald-600" />} label="Phone Number" value={selected.phone} color="emerald" />
                  <InfoBox icon={<Mail className="h-4 w-4 text-blue-600" />} label="Email" value={selected.email} color="blue" />
                  <InfoBox icon={<MapPin className="h-4 w-4 text-purple-600" />} label="Home Address" value={`${selected.home_address}`} color="purple" />
                  <InfoBox icon={<MapPin className="h-4 w-4 text-orange-600" />} label="Work address" value={selected.work_address} color="orange" />
                </div>

                {/* <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Vehicle Information</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Type:</span> {selected.vehicle_type}</p>
                    <p><span className="font-medium">Number:</span> {selected.vehicle_no}</p>
                    <p><span className="font-medium">License:</span> {selected.license_no}</p>
                  </div>
                </div> */}

                {/* <div className="flex space-x-2">
                  <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Call
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Message
                  </button>
                </div> */}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
              <User2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) => (
  <div className={`bg-${color}-50 p-3 rounded-lg`}>
    <div className="flex items-center space-x-2">
      {icon}
      <span className={`text-sm font-medium text-${color}-900`}>{label}</span>
    </div>
    <p className={`text-lg font-bold text-${color}-900`}>{value}</p>
  </div>
);

export default DriverManagement;
