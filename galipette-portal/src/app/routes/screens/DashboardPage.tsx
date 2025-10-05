import { useState, useEffect } from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';
import { type UserResponseDto, type CreateUserDto } from '@galipette/shared';
import usersService from '@/common/services/users.service';
import { UserTable } from './components/UserTable';
import { CreateUserForm } from './components/CreateUserForm';

/**
 * Dashboard Page - User Management
 */
export default function DashboardPage() {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch users from API
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { users: fetchedUsers } = await usersService.getAll();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new user
   */
  const handleCreateUser = async (userData: CreateUserDto) => {
    try {
      await usersService.create(userData);
      setIsCreating(false);
      // Refresh the user list
      await fetchUsers();
    } catch (err: any) {
      console.error('Failed to create user:', err);
      // Re-throw to let the form handle it
      throw new Error(err.response?.data?.message || 'Failed to create user');
    }
  };

  /**
   * Delete a user
   */
  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersService.delete(id);
      // Refresh the user list
      await fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage users for the Galipette Cendree platform
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Card */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
        </div>
        <div className="p-6">
          <UserTable
            users={users}
            onDelete={handleDeleteUser}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Create User Modal */}
      {isCreating && (
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </section>
  );
}
