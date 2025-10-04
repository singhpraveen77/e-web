import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import UserDropdown from "./UserDropDown";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
      : "hover:text-indigo-600";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;

    // Encode search query for URL
    navigate(`/products?search=${encodeURIComponent(trimmedSearch.toLowerCase())}`);
    setSearch("");
  };

  return (
    <nav className="fixed z-10 bg-white w-[100vw] shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
      >
        ShopEase
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center w-1/2 bg-gray-100 rounded-full px-4 py-2"
      >
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <button type="submit">
          <Search className="text-gray-500 cursor-pointer" size={20} />
        </button>
      </form>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6 relative">
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li
            onClick={() => navigate("/")}
            className={`cursor-pointer ${isActive("/")}`}
          >
            Home
          </li>
          <li
            onClick={() => navigate("/products")}
            className={`cursor-pointer ${isActive("/products")}`}
          >
            Shop
          </li>
          <li
            onClick={() => navigate("/contact")}
            className={`cursor-pointer ${isActive("/contact")}`}
          >
            Contact
          </li>
        </ul>

        {/* Cart with badge */}
        <div className="relative">
          <ShoppingCart
            onClick={() => navigate("/cart")}
            className="cursor-pointer hover:text-indigo-600"
            size={26}
          />
          {totalProducts > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
              {totalProducts}
            </span>
          )}
        </div>

        <UserDropdown />
      </div>
    </nav>
  );
}
