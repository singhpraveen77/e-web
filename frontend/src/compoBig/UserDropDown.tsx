import { useState, useRef, useEffect } from "react";
import { User, LogIn, Shield, UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { Logout, me } from "../redux/slices/authSlice";
import { Card } from "../components/ui";
import AppShellSkeleton from "../components/skeletons/AppShellSkeleton";
import { ClipLoader } from "react-spinners";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let onceRun=true;
    if(onceRun){
      dispatch(me());
    }
  }, [dispatch]);

  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };
  
  const menuItems = [
    ...(!user ? [{
      icon: <LogIn size={16} />,
      label: "Sign In",
      onClick: () => navigate('/login'),
      className: "text-[rgb(var(--fg))]"
    }] : []),
    
    ...(user ? [{
      icon: <UserIcon size={16} />,
      label: "Profile",
      onClick: () => navigate('/profile'),
      className: "text-[rgb(var(--fg))]"
    }] : []),
    
    ...(user?.role === "admin" ? [{
      icon: <Shield size={16} />,
      label: "Admin Panel",
      onClick: () => navigate('/admin'),
      className: "text-blue-600 dark:text-blue-400"
    }] : []),
    
    ...(user ? [{
      icon: <LogOut size={16} />,
      label: "Sign Out",
      onClick: () => dispatch(Logout()),
      className: "text-red-600 dark:text-red-400"
    }] : [])
  ];
  if (loading) return <ClipLoader />;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-2 rounded-lg transition-base hover:bg-[rgb(var(--card))] text-[rgb(var(--fg))]"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Avatar Section */}
          {user ? (
            user.avatar?.url ? (
              <img 
                src={user.avatar.url} 
                alt={user.name || 'User'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-600 dark:ring-blue-400 hover:ring-4 transition-all duration-200 flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-blue-600 dark:ring-blue-400 hover:ring-4 transition-all duration-200 shadow-lg">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )
          ) : (
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              <User size={20} className="text-gray-600 dark:text-gray-300" />
            </div>
          )}

          {/* Chevron Icon */}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>


      {/* Dropdown Menu */}
      {isOpen && (
        <Card 
          variant="elevated" 
          padding="none"
          className="absolute right-0 mt-2 w-48 z-50 overflow-hidden"
        >
          {user && (
            <div className="px-4 py-3 border-b border-[rgb(var(--border))]">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar?.url} 
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[rgb(var(--fg))] truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-[rgb(var(--muted))] truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.onClick)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-base hover:bg-[rgb(var(--card))] text-left ${item.className}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
