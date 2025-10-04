import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axiosInstance";

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error.message}</div>;

  return (
    <div className="max-w-3xl mx-auto my-20 h-full">
      <h2 className="text-2xl font-bold mb-6">Users Management</h2>

      
      <div
      className="overflow-y-auto max-h-96"
      >
        <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isDeleted = changes[user._id]?.deleted;
            return (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleToggleRole(user._id, user.role)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    disabled={isDeleted}
                  >
                    Toggle Role
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className={`px-3 py-1 rounded ${
                      isDeleted ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {isDeleted ? "Undo Delete" : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmitChanges}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={Object.keys(changes).length === 0}
        >
          Make Changes
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
