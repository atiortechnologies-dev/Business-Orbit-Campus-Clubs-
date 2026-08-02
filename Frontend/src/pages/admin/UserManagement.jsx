import _React, { useState, useEffect } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { adminUserApi } from "@/api/admin/adminApi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchUsers() {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminUserApi.getUsers();
      setUsers(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);



  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setErrorMsg("");
      await adminUserApi.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to delete user",
      );
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          User Management
        </h1>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-text-muted" size={24} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-inter text-small">
              <thead className="bg-canvas-bg border-b border-border-subtle">
                <tr>
                  <th className="px-4 py-3 font-semibold text-text-muted uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-text-muted uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-text-muted uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 font-semibold text-text-muted uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-canvas-bg/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-text-body">
                      {user.full_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-text-body">{user.email}</td>
                    <td className="px-4 py-3 text-text-body capitalize">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-error hover:opacity-80 p-1"
                        aria-label="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-text-muted"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
