import React, { useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { adminUserApi } from '@/api/admin/adminApi';

export default function UserManagement() {
  const [userId, setUserId] = useState('');

  const handleDelete = async () => {
    if (!userId) return;
    try {
      await adminUserApi.deleteUser(userId);
      alert('User deleted successfully');
      setUserId('');
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">User Management</h1>
      </div>
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="font-semibold mb-2">Delete User</h2>
        <input 
          type="text" 
          placeholder="User ID" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </AdminShell>
  );
}
