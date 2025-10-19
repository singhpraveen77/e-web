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
  Phone,
  Mail,
  Camera,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from "../components/ui";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface UserType {
  name: string;
  email: string;
  phone: string;
  avatar?: string ;  // Fixed: Changed to Avatar | null
  joinedDate?: string;
  totalOrders?: number;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userStore=useSelector((state:RootState)=>state.auth.user);
  // Example user data - replace with actual data from Redux/API
  const [user, setUser] = useState<UserType>({
    name: "Praveen Singh",
    avatar:userStore?.avatar?.url || "",  // Fixed: Changed from avatar?:null to avatar: null
    email: "praveen@example.com",
    phone: "+91 9876543210",
    joinedDate: "January 2024",
    totalOrders: 12
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: API call to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      console.log("Updated user:", user);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const accountOptions = [
    {
      icon: <ShoppingBag size={20} />,
      title: "My Orders",
      description: "View and track your orders",
      onClick: () => navigate("/my-orders"),
      color: "text-blue-600 dark:text-blue-400",
      badge: user.totalOrders
    },
    {
      icon: <MapPin size={20} />,
      title: "Addresses",
      description: "Manage shipping addresses",
      // onClick: () => navigate("/my-addresses"),
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: <Heart size={20} />,
      title: "Wishlist",
      description: "Your saved items",
      // onClick: () => navigate("/wishlist"),
      color: "text-red-600 dark:text-red-400"
    },
    {
      icon: <CreditCard size={20} />,
      title: "Payment Methods",
      description: "Manage payment options",
      // onClick: () => navigate("/payment-methods"),
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Settings size={20} />,
      title: "Account Settings",
      description: "Privacy and preferences",
      // onClick: () => navigate("/account-settings"),
      color: "text-gray-600 dark:text-gray-400"
    },
    {
      icon: <LogOut size={20} />,
      title: "Sign Out",
      description: "Logout from your account",
       onClick: () => dispatch(Logout()),
      color: "text-red-600 dark:text-red-400"
    }
  ];

  return (
    <div className="app-container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card variant="elevated" padding="lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
           {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-600 dark:ring-blue-400"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-blue-600 dark:ring-blue-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg">
                  <Camera size={16} />
                </button>
              )}
            </div>


            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--fg))]">{user.name}</h1>
                  <p className="text-[rgb(var(--muted))] flex items-center gap-2 mt-1">
                    <Mail size={14} />
                    {user.email}
                  </p>
                  {user.joinedDate && (
                    <p className="text-sm text-[rgb(var(--muted))] mt-2">Member since {user.joinedDate}</p>
                  )}
                </div>
                
                <Button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  variant={isEditing ? "success" : "secondary"}
                  leftIcon={isEditing ? <Save size={16} /> : <Edit size={16} />}
                  loading={loading}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={user.name}
                onChange={handleChange}
                disabled={!isEditing}
                leftIcon={<User size={16} />}
                className={!isEditing ? "opacity-75" : ""}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                disabled={!isEditing}
                leftIcon={<Mail size={16} />}
                className={!isEditing ? "opacity-75" : ""}
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={user.phone}
                onChange={handleChange}
                disabled={!isEditing}
                leftIcon={<Phone size={16} />}
                className={!isEditing ? "opacity-75" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Options */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Account Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.onClick}
                  className="group relative p-4 border border-[rgb(var(--border))] rounded-xl hover:shadow-md transition-base bg-[rgb(var(--card))] hover:bg-[rgb(var(--bg))] text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${option.color} group-hover:scale-110 transition-transform`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[rgb(var(--fg))] group-hover:text-[rgb(var(--fg))]">
                        {option.title}
                      </h3>
                      <p className="text-xs text-[rgb(var(--muted))] mt-1">
                        {option.description}
                      </p>
                    </div>
                    {option.badge && (
                      <Badge variant="primary" size="sm">
                        {option.badge}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
