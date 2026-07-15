import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Alert from "../../components/ui/Alert";
import Modal from "../../components/ui/Modal";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { ROLES } from "../../constants";

const BASE_URL = "http://127.0.0.1:5001/api";

const ROLE_OPTIONS = [
  { value: ROLES.SUPER_ADMIN, label: "admin" },
  { value: ROLES.FIELD_TECH, label: "tech" },
];

const emptyForm = { username: "", password: "", role: ROLES.FIELD_TECH, fullName: "", email: "" };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    setForm({ username: user.username, password: "", role: user.role, fullName: user.full_name || "", email: user.email || "" });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const isEdit = !!editingId;
      const url = isEdit ? `${BASE_URL}/users/${editingId}` : `${BASE_URL}/users`;
      const method = isEdit ? "PUT" : "POST";

      const body = { ...form };
      if (isEdit && !body.password) delete body.password;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      setSuccess(isEdit ? "User updated successfully." : "User created successfully.");
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete "${username}"?`)) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      setSuccess(`User "${username}" deleted.`);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500 mt-1">Manage system users and roles.</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Full Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Role</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">{user.username}</td>
                      <td className="py-3 px-4 text-slate-600">{user.full_name || "—"}</td>
                      <td className="py-3 px-4 text-slate-600">{user.email || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === ROLES.SUPER_ADMIN
                            ? "bg-purple-50 text-purple-700"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {user.role === ROLES.SUPER_ADMIN ? "Admin" : "Techinician"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            className="h-8 w-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            className="h-8 w-8 rounded-lg hover:bg-rose-50 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit User" : "Create User"}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              required
              placeholder="johndoe"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password {!editingId && <span className="text-rose-500">*</span>}
              {editingId && <span className="text-xs text-slate-400 ml-1">(kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required={!editingId}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role <span className="text-rose-500">*</span></label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
