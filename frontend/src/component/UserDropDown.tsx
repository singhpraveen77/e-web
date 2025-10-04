import { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";

import { Logout } from "../redux/slices/authSlice";


export default function UserDropdown() {
  
    const [isUserOpen,setIsUserOpen]=useState(false);
    const navigate=useNavigate();
    const {user}=useSelector((state:RootState)=> state.auth)
    const dispatch=useDispatch<AppDispatch>();

    
  return (
    <div className="relative">
      {/* User Icon */}
      <User
        className="cursor-pointer hover:text-indigo-600"
        size={24}
        onClick={() => {
            setIsUserOpen((prev)=>!prev)
            
            console.log(isUserOpen);
            }
        }
      />

      {/* Dropdown */}
      {isUserOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
        >
          <ul className="py-2 text-sm text-gray-700">
            {!user && <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>navigate('/login')}
            >
              Login
            </li>}
            {user?.role=="admin" && <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>navigate('/admin')}
            >
              admin power
            </li>}
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>navigate('/profile')}
            >
              Profile
            </li>
            {true && <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
              onClick={() => dispatch(Logout())
              }
            >
              Sign Out
            </li>}
          </ul>
        </div>
      )}
    </div>
  );
}
