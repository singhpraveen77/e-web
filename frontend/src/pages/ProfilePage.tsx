import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  User,
  Save,
  Edit,
} from "lucide-react";

interface UserType {
  name: string;
  email: string;
  phone: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Example static user — later can fetch from backend
  const [user, setUser] = useState<UserType>({
    name: "Praveen Singh",
    email: "praveen@example.com",
    phone: "+91 9876543210",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated user:", user);
    // TODO: send to backend using axios
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="text-indigo-600" size={28} /> My Profile
          </h1>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Save size={18} /> Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Edit size={18} /> Edit
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                isEditing
                  ? "focus:ring-indigo-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                isEditing
                  ? "focus:ring-indigo-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                isEditing
                  ? "focus:ring-indigo-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Account Options */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Account Options
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-indigo-50"
          >
            <ShoppingBag className="text-indigo-600" />
            <span className="font-medium text-gray-800">My Orders</span>
          </button>

          <button
            onClick={() => navigate("/my-addresses")}
            className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-indigo-50"
          >
            <MapPin className="text-indigo-600" />
            <span className="font-medium text-gray-800">My Addresses</span>
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-indigo-50"
          >
            <Heart className="text-indigo-600" />
            <span className="font-medium text-gray-800">Wishlist</span>
          </button>

          <button
            onClick={() => navigate("/payment-methods")}
            className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-indigo-50"
          >
            <CreditCard className="text-indigo-600" />
            <span className="font-medium text-gray-800">Payment Methods</span>
          </button>

          <button
            onClick={() => navigate("/account-settings")}
            className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-indigo-50"
          >
            <Settings className="text-indigo-600" />
            <span className="font-medium text-gray-800">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-red-50"
          >
            <LogOut className="text-red-600" />
            <span className="font-medium text-gray-800">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
