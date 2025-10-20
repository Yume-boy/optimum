import React, { useState } from 'react';
import { Truck, User, Star, DollarSign, Package, MapPin, Phone, Mail, MoreVertical, Search,  } from 'lucide-react';
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
  const { data: drivers, isLoading, isError } = useFetchResourceQuery('all/drivers');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy driver data
  const drive: Driver[] = [
    {
      id: '1',
      fullname: 'John Doe',
      email: 'john@example.com',
      phone: '+234 810 555 1234',
      vehicle_type: 'Truck',
      vehicle_no: 'ABC-123-XY',
      license_no: 'DRV-998877',
      created_at: '2025-10-10',
      updated_at: '2025-10-15',
      role: 'Driver',
      isAvailable: true,
      rating: 4.8,
      totalDeliveries: 25,
      earnings: 1200.5,
    },
    {
      id: '2',
      fullname: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+234 810 222 3344',
      vehicle_type: 'Van',
      vehicle_no: 'XYZ-987-ZZ',
      license_no: 'DRV-556677',
      created_at: '2025-09-22',
      updated_at: '2025-09-25',
      role: 'Driver',
      isAvailable: false,
      rating: 4.6,
      totalDeliveries: 40,
      earnings: 2400.75,
    },
    {
      id: '3',
      fullname: 'Michael Johnson',
      email: 'mike@example.com',
      phone: '+234 812 777 8899',
      vehicle_type: 'Bike',
      vehicle_no: 'MJK-333-AA',
      license_no: 'DRV-112233',
      created_at: '2025-08-18',
      updated_at: '2025-08-20',
      role: 'Driver',
      isAvailable: true,
      rating: 4.9,
      totalDeliveries: 12,
      earnings: 600.25,
    },
  ];

  // Filtering drivers
  const filteredDrivers = drivers?.drivers.data.filter((driver:any) =>
    driver.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selected = drivers?.drivers.data.find((driver:any) => driver.id === selectedDriver);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <div className="text-sm text-gray-600">
          {drivers?.drivers.data.filter((d:any) => d.isAvailable).length} available • {drivers?.drivers.data.filter((d:any) => !d.isAvailable).length} busy
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredDrivers?.length} drivers found
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
                    <Truck className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{driver.fullname}</h4>
                    <p className="text-sm text-gray-600">
                      {driver.vehicle_type} • {driver.vehicle_no}
                    </p>
                    
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
                <h3 className="text-lg font-semibold text-gray-900">Driver Details</h3>
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
                    <p className="text-sm text-gray-600">License: {selected.license_no}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoBox icon={<Phone className="h-4 w-4 text-emerald-600" />} label="Phone Number" value={selected.phone} color="emerald" />
                  <InfoBox icon={<Mail className="h-4 w-4 text-blue-600" />} label="Email" value={selected.email} color="blue" />
                  <InfoBox icon={<MapPin className="h-4 w-4 text-purple-600" />} label="Home Address" value={`${selected.home_address}`} color="purple" />
                  <InfoBox icon={<MapPin className="h-4 w-4 text-orange-600" />} label="Work address" value={selected.work_address} color="orange" />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Vehicle Information</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Type:</span> {selected.vehicle_type}</p>
                    <p><span className="font-medium">Number:</span> {selected.vehicle_no}</p>
                    <p><span className="font-medium">License:</span> {selected.license_no}</p>
                  </div>
                </div>

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
              <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a driver to view details</p>
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
