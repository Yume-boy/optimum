import React, { useState, useEffect } from 'react';
import { User, Users, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { addStaff, fetchStaff, Staff } from '../../Auth/slices/staffSlice'; // Import fetchStaff and Staff type
import type { RootState } from '../../Auth/store'; // Adjust path to your Redux store type
import AddStaffForm from './AddStaffForm';
import Modal from './Modal'; // Assuming this path is correct now

// Assuming Role type is defined in a common types file
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface UserRoleForm {
  userId: string;
  roleId: string;
}

interface UserManagementProps {
  // mockUsers no longer needed as we'll fetch from Redux
  systemRoles: Role[];
  onUserRoleSubmit: (data: UserRoleForm) => void;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ systemRoles, onUserRoleSubmit, selectedUser, setSelectedUser }) => {
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const { register, handleSubmit } = useForm<UserRoleForm>();
  const dispatch = useDispatch();

  // Select staff members, loading state, and error from the Redux store
  const { staffMembers, loading, error } = useSelector((state: RootState) => state.staff);

  // Fetch staff members when the component mounts
  useEffect(() => {
    dispatch(fetchStaff() as any); // Type assertion for async thunk
  }, [dispatch]);

  const onSubmitRoleChange = (data: UserRoleForm) => {
    onUserRoleSubmit(data);
  };

  const handleAddStaff = async (staffData: any) => {
    console.log('Dispatching addStaff with data:', staffData);
    try {
      const resultAction = await dispatch(addStaff(staffData) as any);
      
      if (addStaff.fulfilled.match(resultAction)) {
        alert('New staff member added successfully!');
        setShowAddStaffForm(false);
      } else {
        alert(`Failed to add staff member: ${resultAction.payload || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('An unexpected error occurred while adding staff.');
    }
  };



  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button
          onClick={() => setShowAddStaffForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Staff</span>
        </button>
      </div>
      {
          loading ?  <div className="text-center py-8">Loading staff members...</div> : error ? <div className="text-center py-8 text-red-600">Error: {error}</div>
       :

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffMembers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No staff members added yet.
                </td>
              </tr>
            ) : (
              staffMembers?.map((staff: Staff) => ( // Use staffMembers from Redux
                <tr key={staff.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.fullname}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(staff.id)} // Assuming you'd select by staff.id
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Change Role
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      }

      {/* Role Assignment Modal */}
      <Modal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="Assign Role"
      >
        <form onSubmit={handleSubmit(onSubmitRoleChange)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <input type="hidden" value={selectedUser || ''} {...register('userId', { required: true })} />
            <select
              {...register('roleId', { required: 'Role is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a role</option>
              {systemRoles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700"
            >
              Assign Role
            </button>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        isOpen={showAddStaffForm}
        onClose={() => setShowAddStaffForm(false)}
        title="Add New Staff Member"
      >
        <AddStaffForm
          systemRoles={systemRoles}
          onSave={handleAddStaff}
          onCancel={() => setShowAddStaffForm(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;