'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api/axios';

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showPrivilegesModal, setShowPrivilegesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privileges, setPrivileges] = useState({
    can_add_products: false,
    can_update_products: false,
    can_delete_products: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contact?.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || response.data);
      setFilteredUsers(response.data.users || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      await api.patch(`/admin/users/${id}/${endpoint}`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status');
    }
  };

  const openPrivilegesModal = async (user) => {
    setSelectedUser(user);
    try {
      const response = await api.get(`/admin/users/${user.id}/privileges`);
      setPrivileges(response.data.privileges || {
        can_add_products: false,
        can_update_products: false,
        can_delete_products: false
      });
      setShowPrivilegesModal(true);
    } catch (error) {
      console.error('Error fetching privileges:', error);
      setPrivileges({
        can_add_products: false,
        can_update_products: false,
        can_delete_products: false
      });
      setShowPrivilegesModal(true);
    }
  };

  const handlePrivilegeChange = (privilege) => {
    setPrivileges(prev => ({
      ...prev,
      [privilege]: !prev[privilege]
    }));
  };

  const savePrivileges = async () => {
    try {
      await api.put(`/admin/users/${selectedUser.id}/privileges`, privileges);
      alert('Privileges updated successfully!');
      setShowPrivilegesModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating privileges:', error);
      alert('Failed to update privileges');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Users Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage users and their privileges
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/users/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add New User
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search users by name, email, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fname} {user.lname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openPrivilegesModal(user)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 mr-3"
                        >
                          Privileges
                        </button>
                        <button
                          onClick={() => toggleStatus(user.id, user.status)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 mr-3"
                        >
                          {user.status ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privileges Modal */}
        {showPrivilegesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Manage Privileges
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                User: {selectedUser?.fname} {selectedUser?.lname}
              </p>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privileges.can_add_products}
                    onChange={() => handlePrivilegeChange('can_add_products')}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-900 dark:text-white">
                    Can Add Products
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privileges.can_update_products}
                    onChange={() => handlePrivilegeChange('can_update_products')}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-900 dark:text-white">
                    Can Update Products
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privileges.can_delete_products}
                    onChange={() => handlePrivilegeChange('can_delete_products')}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-900 dark:text-white">
                    Can Delete Products
                  </span>
                </label>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={savePrivileges}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowPrivilegesModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}