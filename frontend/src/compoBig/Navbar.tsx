import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import UserDropdown from "./UserDropDown";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import ThemeToggle from "../components/ThemeToggle";

export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-[rgb(var(--fg))] font-semibold"
      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = search.trim();
    if (!trimmedSearch) {
      setSearch("");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmedSearch.toLowerCase())}`);
    setSearch("");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div
                onClick={() => navigate("/")}
                className="text-2xl font-bold text-[rgb(var(--fg))] cursor-pointer select-none transition-all duration-200 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400"
              >
                ShopEase
              </div>
            </div>

            {/* Center Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full relative group"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 group-hover:border-[rgb(var(--fg))]/20"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[rgb(var(--muted))] hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-6">
                <button 
                  onClick={() => navigate("/")} 
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/" 
                      ? "text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => navigate("/products")} 
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/products" 
                      ? "text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  Shop
                </button>
                <button 
                  onClick={() => navigate("/contact")} 
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/contact" 
                      ? "text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  Contact
                </button>
              </nav>
              
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Cart */}
                <div className="relative">
                  <button 
                    onClick={() => navigate("/cart")} 
                    className="p-2 text-[rgb(var(--fg))] hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110 hover:bg-[rgb(var(--card))] rounded-full"
                    aria-label="Open cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  {totalProducts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                      {totalProducts}
                    </span>
                  )}
                </div>
                
                {/* User Dropdown */}
                <UserDropdown />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              
              {/* Mobile Cart */}
              <div className="relative">
                <button 
                  onClick={() => navigate("/cart")} 
                  className="p-2 text-[rgb(var(--fg))] hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label="Open cart"
                >
                  <ShoppingCart size={20} />
                </button>
                {totalProducts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                    {totalProducts}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[rgb(var(--fg))] hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed top-16 left-0 right-0 bg-[rgb(var(--bg))] border-b border-[rgb(var(--border))] shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[rgb(var(--muted))] hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <button 
                  onClick={() => { navigate("/"); setMobileMenuOpen(false); }} 
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/" 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
                      : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => { navigate("/products"); setMobileMenuOpen(false); }} 
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/products" 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
                      : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                  }`}
                >
                  Shop
                </button>
                <button 
                  onClick={() => { navigate("/contact"); setMobileMenuOpen(false); }} 
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/contact" 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
                      : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                  }`}
                >
                  Contact
                </button>
              </nav>
              
              {/* Mobile User Section */}
              <div className="pt-4 border-t border-[rgb(var(--border))]">
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
