import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Package, BarChart3, Settings, Shield, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "../../components/ui";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock stats - replace with real data from API
  const stats = [
    {
      title: "Total Users",
      value: "2,547",
      change: "+12%",
      changeType: "positive",
      icon: <Users size={24} />,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Products",
      value: "1,234",
      change: "+5%",
      changeType: "positive",
      icon: <Package size={24} />,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Orders",
      value: "3,891",
      change: "+23%",
      changeType: "positive",
      icon: <ShoppingCart size={24} />,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Revenue",
      value: "₹4,32,180",
      change: "+18%",
      changeType: "positive",
      icon: <DollarSign size={24} />,
      color: "text-orange-600 dark:text-orange-400"
    }
  ];

  const adminModules = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: <Users size={32} />,
      onClick: () => navigate("/admin/users"),
      color: "bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400",
      stats: "2,547 users"
    },
    {
      title: "Product Management",
      description: "Add, edit, and manage product inventory",
      icon: <Package size={32} />,
      onClick: () => navigate("/admin/products"),
      color: "bg-green-600 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-400",
      stats: "1,234 products"
    },
    {
      title: "Analytics",
      description: "View sales reports and business insights",
      icon: <BarChart3 size={32} />,
      // onClick: () => navigate("/admin/analytics"),
      color: "bg-purple-600 dark:bg-purple-500 hover:bg-purple-500 dark:hover:bg-purple-400",
      stats: "View reports"
    },
    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: <Settings size={32} />,
      // onClick: () => navigate("/admin/settings"),
      color: "bg-gray-600 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400",
      stats: "System config"
    }
  ];

  return (
    <div className="app-container py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[rgb(var(--fg))]">Admin Dashboard</h1>
            <p className="text-[rgb(var(--muted))] mt-1">Manage your eCommerce platform</p>
          </div>
        </div>

        {/* Stats Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[rgb(var(--muted))]">{stat.title}</p>
                    <p className="text-2xl font-bold text-[rgb(var(--fg))] mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp size={12} className="text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{stat.change} from last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} opacity-80`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Modules */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Management Modules</CardTitle>
            <CardDescription>
              Access different areas of the admin panel to manage your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminModules.map((module, index) => (
                <button
                  key={index}
                  onClick={module.onClick}
                  className="group relative overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--bg))] transition-all hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg text-white ${module.color} transition-colors`}>
                        {module.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold text-[rgb(var(--fg))] group-hover:text-[rgb(var(--fg))]">
                          {module.title}
                        </h3>
                        <p className="text-sm text-[rgb(var(--muted))] mt-1 leading-relaxed">
                          {module.description}
                        </p>
                        <div className="mt-3">
                          <Badge variant="secondary" size="sm">
                            {module.stats}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate("/admin/products/addProducts")}
                className="p-4 text-center border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card))] transition-base"
              >
                <Package size={20} className="mx-auto mb-2 text-[rgb(var(--muted))]" />
                <span className="text-sm font-medium text-[rgb(var(--fg))]">Add Product</span>
              </button>
              
              <button 
                onClick={() => navigate("/admin/users")}
                className="p-4 text-center border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card))] transition-base"
              >
                <Users size={20} className="mx-auto mb-2 text-[rgb(var(--muted))]" />
                <span className="text-sm font-medium text-[rgb(var(--fg))]">View Users</span>
              </button>
              
              <button 
                className="p-4 text-center border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card))] transition-base"
              >
                <BarChart3 size={20} className="mx-auto mb-2 text-[rgb(var(--muted))]" />
                <span className="text-sm font-medium text-[rgb(var(--fg))]">Analytics</span>
              </button>
              
              <button 
                className="p-4 text-center border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card))] transition-base"
              >
                <Settings size={20} className="mx-auto mb-2 text-[rgb(var(--muted))]" />
                <span className="text-sm font-medium text-[rgb(var(--fg))]">Settings</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
