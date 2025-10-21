import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axiosInstance";
import { Users, UserCheck, Shield, Trash2, Undo, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../../components/ui";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

type ChangeStatus = {
  newRole?: "user" | "admin";
  deleted?: boolean;
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [changes, setChanges] = useState<Record<string, ChangeStatus>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 👈 used to refetch automatically

  // 🔹 Fetch users
  useEffect(() => {
    const getAllUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get("/admin/users");
        const fetchedUser: User[] = res?.data?.data?.map((item: any) => ({
          _id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
        }));

        setUsers(fetchedUser);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getAllUser();
  }, [refreshTrigger]); // 👈 runs when refreshTrigger changes

  // 🔸 Toggle role (user <-> admin)
  const handleToggleRole = (id: string, currentRole: "user" | "admin") => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, role: currentRole === "admin" ? "user" : "admin" } : u
      )
    );

    setChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], newRole: currentRole === "admin" ? "user" : "admin" },
    }));
  };

  // 🔸 Delete or Undo Delete
  const handleDelete = (id: string) => {
    const isDeleted = changes[id]?.deleted;

    if (!isDeleted) {
      // mark deleted
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setChanges((prev) => ({
        ...prev,
        [id]: { ...prev[id], deleted: true },
      }));
    } else {
      // undo delete
      setChanges((prev) => {
        const { deleted, ...rest } = prev[id];
        return { ...prev, [id]: rest };
      });
    }
  };

  // 🔸 Submit all changes (batch update)
  const handleSubmitChanges = async () => {
    try {
      setLoading(true);

      const updatedRoles: Record<string, "user" | "admin"> = {};
      const deleted: string[] = [];

      for (const [id, change] of Object.entries(changes)) {
        if (change.deleted) deleted.push(id);
        else if (change.newRole) updatedRoles[id] = change.newRole;
      }

      await axiosInstance.post("/admin/users/batch-update", {
        updatedRoles,
        deleted,
      });

      alert("✅ Changes saved successfully!");
      setChanges({});
      setRefreshTrigger((prev) => prev + 1); // 👈 trigger automatic refetch
    } catch (err: any) {
      console.error("Error submitting changes:", err);
      alert("❌ Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="app-container py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="skeleton skeleton--circle" />
          <div className="skeleton skeleton--text w-25" />
        </div>
        <div className="card p-4">
          <div className="skeleton skeleton--text w-33 mb-4" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[rgb(var(--border))]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <th key={i} className="text-left p-2 sm:p-3">
                      <div className="skeleton skeleton--text w-50" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, r) => (
                  <tr key={r} className="border-b border-[rgb(var(--border))]">
                    {Array.from({ length: 4 }).map((_, c) => (
                      <td key={c} className="p-2 sm:p-3">
                        <div className={`skeleton skeleton--text ${["w-75","w-50","w-66","w-33"][ (r+c)%4]}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="app-container py-8">
      <Card variant="outlined" className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            <Users size={32} className="mx-auto" />
          </div>
          <p className="text-red-600 dark:text-red-400">{error.message}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="app-container py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--fg))]">User Management</h1>
            <p className="text-sm text-[rgb(var(--muted))]">Manage user accounts and permissions</p>
          </div>
        </div>

        {/* Users Table */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>System Users</CardTitle>
              <div className="flex items-center gap-4">
                {Object.keys(changes).length > 0 && (
                  <Badge variant="secondary">
                    {Object.keys(changes).length} pending changes
                  </Badge>
                )}
                <Badge variant="outline">
                  {users.length} total users
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto transition-all duration-200">
              <table className="w-full min-w-[720px] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[rgb(var(--border))]">
                    <th className="text-left p-2 sm:p-3 font-medium text-[rgb(var(--muted))]">User</th>
                    <th className="text-left p-2 sm:p-3 font-medium text-[rgb(var(--muted))]">Email</th>
                    <th className="text-left p-2 sm:p-3 font-medium text-[rgb(var(--muted))]">Role</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-[rgb(var(--muted))]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isDeleted = changes[user._id]?.deleted;
                    const hasRoleChange = changes[user._id]?.newRole;
                    
                    return (
                      <tr 
                        key={user._id} 
                        className={`border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--card))] transition-colors ${
                          isDeleted ? 'opacity-50 bg-red-50 dark:bg-red-900/20' : ''
                        }`}
                      >
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <UserCheck size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium text-[rgb(var(--fg))]">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="text-xs sm:text-sm text-[rgb(var(--muted))]">{user.email}</span>
                        </td>
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={user.role === 'admin' ? 'primary' : 'secondary'}
                              size="sm"
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <Shield size={12} className="mr-1" />
                                  Admin
                                </>
                              ) : (
                                'User'
                              )}
                            </Badge>
                            {hasRoleChange && (
                              <Badge variant="outline" size="sm">Modified</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2 sm:p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handleToggleRole(user._id, user.role)}
                              variant="outline"
                              size="sm"
                              disabled={isDeleted}
                              leftIcon={user.role === 'admin' ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                            >
                              {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </Button>
                            <Button
                              onClick={() => handleDelete(user._id)}
                              variant={isDeleted ? "success" : "danger"}
                              size="sm"
                              leftIcon={isDeleted ? <Undo size={14} /> : <Trash2 size={14} />}
                            >
                              {isDeleted ? "Undo" : "Delete"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto mb-4 text-[rgb(var(--muted))]" size={48} />
                  <p className="text-lg text-[rgb(var(--muted))]">No users found</p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">Users will appear here when they sign up</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {Object.keys(changes).length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitChanges}
              variant="primary"
              disabled={loading}
            >
              {loading ? "Saving Changes..." : "Save All Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
