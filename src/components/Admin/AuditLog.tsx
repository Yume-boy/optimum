import React, { useState } from 'react';
import { Search, Filter, Clock, User, Info, AlertCircle } from 'lucide-react';

// Define the AuditLogEntry interface
interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601 string for easy sorting and display
  actor: string; // User who performed the action
  action: string; // What action was performed (e.g., "Order Created", "Driver Updated")
  target: string; // What entity was affected (e.g., "Order #123", "Driver ID: 456")
  details?: string; // Optional: more specific details about the action
  status: 'Success' | 'Failed' | 'Info'; // Outcome of the action
}

// Mock Data for Audit Log Entries
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2025-07-30T10:00:00Z',
    actor: 'John Doe (Admin)',
    action: 'Order Created',
    target: 'Order #ORD78901',
    details: 'New order for customer "ABC Logistics" created.',
    status: 'Success',
  },
  {
    id: 'log-2',
    timestamp: '2025-07-30T10:15:30Z',
    actor: 'Jane Smith (Ops Mgr)',
    action: 'Shipment Status Updated',
    target: 'Shipment #SHP23456',
    details: 'Status changed from "Pending Pickup" to "In Transit".',
    status: 'Success',
  },
  {
    id: 'log-3',
    timestamp: '2025-07-30T11:05:10Z',
    actor: 'System (Automated)',
    action: 'Driver Availability Check',
    target: 'Driver ID: DRV987',
    details: 'Driver automatically marked as unavailable due to inactivity.',
    status: 'Info',
  },
  {
    id: 'log-4',
    timestamp: '2025-07-30T11:30:45Z',
    actor: 'Bob Johnson (Driver)',
    action: 'Password Change',
    target: 'User Account: bob.johnson@example.com',
    details: 'Password change initiated from IP: 203.0.113.45',
    status: 'Success',
  },
  {
    id: 'log-5',
    timestamp: '2025-07-30T11:45:00Z',
    actor: 'Alice Brown (User)',
    action: 'Login Attempt',
    target: 'User Account: alice.brown@example.com',
    details: 'Failed login attempt due to incorrect password.',
    status: 'Failed',
  },
  {
    id: 'log-6',
    timestamp: '2025-07-30T12:00:00Z',
    actor: 'John Doe (Admin)',
    action: 'Driver Profile Edited',
    target: 'Driver ID: DRV123',
    details: 'Updated vehicle type for driver "Alice Smith" to "Van".',
    status: 'Success',
  },
  {
    id: 'log-7',
    timestamp: '2025-07-30T12:30:00Z',
    actor: 'API User (Integration)',
    action: 'Inventory Adjustment',
    target: 'Warehouse: WH001, Item: ITEM999',
    details: 'Quantity adjusted by +50 from external system.',
    status: 'Success',
  },
  {
    id: 'log-8',
    timestamp: '2025-07-30T13:00:00Z',
    actor: 'Jane Smith (Ops Mgr)',
    action: 'Route Optimization Run',
    target: 'Routes for 2025-07-30',
    details: 'Optimized 5 routes, reducing total distance by 10%.',
    status: 'Info',
  },
  {
    id: 'log-9',
    timestamp: '2025-07-30T13:45:00Z',
    actor: 'Super Administrator',
    action: 'User Role Changed',
    target: 'User: user-3 (Peter Jones)',
    details: 'Role changed from "Operations Manager" to "Administrator".',
    status: 'Success',
  },
  {
    id: 'log-10',
    timestamp: '2025-07-30T14:00:00Z',
    actor: 'System',
    action: 'Database Backup',
    target: 'Logistics DB',
    details: 'Daily scheduled backup completed successfully.',
    status: 'Success',
  },
  {
    id: 'log-11',
    timestamp: '2025-07-30T14:10:00Z',
    actor: 'Customer Support',
    action: 'Customer Account Viewed',
    target: 'Customer: CUST005',
    details: 'Viewed sensitive customer details for support inquiry.',
    status: 'Info',
  },
  {
    id: 'log-12',
    timestamp: '2025-07-30T14:20:00Z',
    actor: 'Unknown',
    action: 'Unauthorized Access Attempt',
    target: 'API Endpoint: /api/orders/delete',
    details: 'Attempt to delete orders without proper authentication.',
    status: 'Failed',
  },
];

const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Success' | 'Failed' | 'Info'>('All');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = searchTerm.toLowerCase() === '' ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first

  const getStatusIcon = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'Success':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Adjust formatting as needed for your locale
  };

  return (
    <div className="bg-gray-100 min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Clock className="mr-3 h-8 w-8 text-emerald-600" /> Audit Log
        </h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by actor, action, or target..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="w-[300px] pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Success' | 'Failed' | 'Info')}
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Info">Info</option>
              </select>
              {/* Custom arrow for select dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15 8.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.707l4.293 4.243z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="">
            <table className=" divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Clock className="inline-block h-4 w-4 mr-1" /> Time
                  </th>
                  <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <User className="inline-block h-4 w-4 mr-1" /> Actor
                  </th>
                  <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className=" py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No audit log entries found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className=" py-4 whitespace-nowrap text-sm text-gray-800">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.actor}
                      </td>
                      <td className=" py-4 whitespace-nowrap text-sm text-gray-800">
                        {log.action}
                      </td>
                      <td className=" py-4 whitespace-nowrap text-sm text-gray-800">
                        {log.target}
                      </td>
                      <td className=" py-4 text-sm text-gray-600">
                        {log.details || '-'}
                      </td>
                      <td className=" py-4 whitespace-nowrap text-sm">
                        <span className="flex items-center">
                          {getStatusIcon(log.status)}
                          <span className="ml-2">{log.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;