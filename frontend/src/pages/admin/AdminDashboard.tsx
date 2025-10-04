import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 mt-8">
        {/* Users Box */}
        <div
          onClick={() => navigate("/admin/users")}
          className="w-40 h-40 flex items-center justify-center bg-blue-500 text-white font-semibold rounded-xl shadow-lg cursor-pointer hover:bg-blue-600"
        >
          Manage Users
        </div>

        {/* Products Box */}
        <div
          onClick={() => navigate("/admin/products")}
          className="w-40 h-40 flex items-center justify-center bg-green-500 text-white font-semibold rounded-xl shadow-lg cursor-pointer hover:bg-green-600"
        >
          Manage Products
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
