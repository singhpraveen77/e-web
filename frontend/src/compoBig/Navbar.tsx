import { useState, useEffect } from "react";
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

  // 👇 state for scroll direction
  const [showNav, setShowNav] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);

  // 👇 improved scroll listener with threshold & performance tweaks
  useEffect(() => {
  let ticking = false;
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only trigger when scroll difference is significant
        if (Math.abs(currentScrollY - lastScrollY) > 10) {
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowNav(false); // scrolling down → hide
          } else {
            setShowNav(true); // scrolling up → show
          }
          lastScrollY = currentScrollY;
        }

        ticking = false;
      });

      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = search.trim();
    if (!trimmedSearch) {
      setSearch("");
      return;
    }
    setMobileMenuOpen(false)
    navigate(`/products?search=${encodeURIComponent(trimmedSearch.toLowerCase())}`);
    setSearch("");
  };

  return (
    <>
      {/* ✅ Navbar with scroll effect */}
      <nav
          className={`fixed top-1 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-0.5rem)] md:w-auto
          rounded-3xl border border-[rgb(var(--border))] 
          bg-[rgb(var(--card))]/70 backdrop-blur-3xl shadow-lg
          transition-transform duration-500 ease-in-out
          ${showNav ? "translate-y-0" : "-translate-y-[150%]"}`}
        >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
             <div className="flex items-center">
            {/* Text logo — visible on medium and larger screens */}
            <div
              onClick={() => navigate("/")}
              className="md:block text-2xl font-bold text-[rgb(var(--fg))] cursor-pointer select-none transition-all duration-200 hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400"
            >
              ShopEase
            </div>

             
          </div>

            {/* Center Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full relative group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[10vw] pl-4 pr-12 py-2.5 lg:py-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 group-hover:border-[rgb(var(--fg))]/20"
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
              <nav className="flex space-x-2 lg:space-x-6">
                <button
                  onClick={() => navigate("/")}
                  className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/products"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/contact"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className={`w-25 px-2 lg:px-2 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/about"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  About-Us
                </button>
              </nav>

              <div className="flex items-center space-x-2 lg:space-x-4">
                <ThemeToggle />

                {/* Cart */}
                <div className="relative">
                  <button
                    onClick={() => navigate("/cart")}
                    className="p-1.5 lg:p-2 text-[rgb(var(--fg))] hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110 hover:bg-[rgb(var(--card))] rounded-full"
                    aria-label="Open cart"
                  >
                    <ShoppingCart size={18} className="lg:w-5 lg:h-5" />
                  </button>
                  {totalProducts > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                      {totalProducts}
                    </span>
                  )}
                </div>

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

                {/* User Dropdown always visible on navbar */}
                <UserDropdown />
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

      {/* ✅ Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        >
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
                {["/", "/products", "/contact", "/about"].map((path) => (
                  <button
                    key={path}
                    onClick={() => {
                      console.log("checking");
                      
                      setMobileMenuOpen(false);
                      navigate(path);
                      console.log("checking after");
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === path
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                    }`}
                  >
                    {path === "/"
                      ? "Home"
                      : path === "/products"
                      ? "Shop"
                      : path === "/contact"
                      ? "Contact"
                      : "About Us"}
                  </button>
                ))}
              </nav>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
