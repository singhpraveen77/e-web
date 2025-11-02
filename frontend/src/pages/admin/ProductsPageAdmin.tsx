import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AllProducts } from "../../api/products.api";
import { 
  Package, 
  Plus, 
  Trash2, 
  Undo, 
  TrendingUp, 
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Sparkles,
  RotateCcw,
  Minus
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../../components/ui";
import { axiosInstance } from "../../axios/axiosInstance";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  createdAt?: string;
}

type ChangeStatus = {
  newStock?: number;
  deleted?: boolean;
};

type SortOption = 
  | "name-asc" 
  | "name-desc" 
  | "price-asc" 
  | "price-desc" 
  | "stock-asc" 
  | "stock-desc"
  | "date-asc"
  | "date-desc";

type DateFilter = "all" | "7days" | "30days";



const toastVariants = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 24 } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2, ease: "easeOut" } }
}; // small, animated row toasts w/ ease-out is a common UX pattern [web:77][web:74].

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, ChangeStatus>>({});
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // per-row toast state: show transient +1 / -1 popup
  const [rowToast, setRowToast] = useState<Record<string, { delta: number; key: number }>>({});

  const navigate = useNavigate();

  // lock body scroll for sidebar overlay
  useEffect(() => {
    if (sidebarOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [sidebarOpen]); // side overlay patterns often lock scrolling for accessibility [web:68].

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await AllProducts();
        setProducts(fetchedProducts || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshTrigger]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]); // debounced filtering is standard for responsive inputs [web:54].


  



  // Unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  // Newest product
  const newestProduct = useMemo(() => {
    if (products.length === 0) return null;
    return [...products].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })[0];
  }, [products]);

  // Date filter
  const filterByDate = (product: Product) => {
    if (dateFilter === "all") return true;
    const productDate = new Date(product.createdAt || 0);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - productDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dateFilter === "7days") return diffDays <= 7;
    if (dateFilter === "30days") return diffDays <= 30;
    return true;
  }; // simple day-diff preset date ranges [web:45][web:38][web:33].

  // Filter, sort
  const processedProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }
    filtered = filtered.filter(filterByDate);
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        case "date-asc":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "date-desc":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
    return filtered;
  }, [products, debouncedSearch, sortBy, selectedCategories, dateFilter]); // consistent processing order improves UX in tables [web:55].

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = processedProducts.slice(startIndex, endIndex);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("date-desc");
    setSelectedCategories([]);
    setDateFilter("all");
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  // Category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Row toast trigger
  const pingRowToast = (id: string, delta: number) => {
    // bump a unique key to retrigger AnimatePresence even if same id spams
    const key = Date.now();
    setRowToast((prev) => ({ ...prev, [id]: { delta, key } }));
    // auto clear after 1200ms
    setTimeout(() => {
      setRowToast((prev) => {
        // only clear if still showing same key (avoid race with rapid clicks)
        if (prev[id]?.key === key) {
          const clone = { ...prev };
          delete clone[id];
          return clone;
        }
        return prev;
      });
    }, 1200);
  }; // small per-row toast avoids global libs and allows custom motion [web:77][web:74].

  // Stock actions
  const handleSetStock = (id: string, value: number) => {
    const v = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    setChanges((prev) => ({ ...prev, [id]: { ...prev[id], newStock: v } }));
  };

  const handleIncrement = (id: string, current: number) => {
    const next = Math.max(0, current + 1);
    setChanges((prev) => ({ ...prev, [id]: { ...prev[id], newStock: next } }));
    pingRowToast(id, +1);
  };

  const handleDecrement = (id: string, current: number) => {
    const next = Math.max(0, current - 1);
    setChanges((prev) => ({ ...prev, [id]: { ...prev[id], newStock: next } }));
    pingRowToast(id, -1);
  };

  // Delete toggle
  const handleDelete = (id: string) => {
    const isDeleted = changes[id]?.deleted;
    setChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], deleted: !isDeleted },
    }));
  };

  // Submit changes
  const handleSubmitChanges = async () => {
    try {
      setSaving(true);
      const updatedStocks: Record<string, number> = {};
      const deleted: string[] = [];
      for (const [id, change] of Object.entries(changes)) {
        if (change.deleted) deleted.push(id);
        else if (change.newStock !== undefined) updatedStocks[id] = change.newStock;
      }
      await axiosInstance.post("/admin/product/batch-update", { updatedStocks, deleted });
      alert("✅ Changes saved successfully!");
      setChanges({});
      setRefreshTrigger((prev) => !prev);
    } catch (err: any) {
      console.error("Error saving changes:", err);
      alert("❌ Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  }; // compact ellipsis style pagination is widely used in React apps [web:55][web:53].

  const hasActiveFilters = 
    searchQuery || 
    sortBy !== "date-desc" || 
    selectedCategories.length > 0 || 
    dateFilter !== "all" || 
    itemsPerPage !== 10;

  if (loading) {
    return (
      <div className="app-container py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="skeleton skeleton--circle" />
            <div className="skeleton skeleton--text w-25" />
          </div>
          <div className="card p-4">
            <div className="skeleton skeleton--text w-33 mb-4" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-[rgb(var(--border))]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <th key={i} className="text-left p-2 sm:p-3">
                        <div className="skeleton skeleton--text w-50" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, r) => (
                    <tr key={r} className="border-b border-[rgb(var(--border))]">
                      {Array.from({ length: 5 }).map((_, c) => (
                        <td key={c} className="p-2 sm:p-3">
                          <div className={`skeleton skeleton--text ${["w-75", "w-50", "w-66", "w-33"][(r + c) % 4]}`} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ); // skeleton keeps layout stable during load [web:55].
  }

  if (error) {
    return (
      <div className="app-container py-8">
        <Card variant="outlined" className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">
              <Package size={32} className="mx-auto" />
            </div>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-container py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 dark:bg-green-500 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--fg))]">Products Management</h1>
              <p className="text-sm text-[rgb(var(--muted))]">Manage your product inventory and stock</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="outline"
              size="sm"
              leftIcon={sidebarOpen ? <X size={16} /> : <Filter size={16} />}
              className="lg:hidden"
            >
              {sidebarOpen ? "Close" : "Filters"}
            </Button>
            <Button
              onClick={() => navigate("/admin/products/addProducts")}
              variant="primary"
              leftIcon={<Plus size={16} />}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Search + Sort + IPP */}
            <Card className="bg-transparent border-none p-0">
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" size={18} />
                      <input
                        type="text"
                        placeholder="Search ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[10vw] min-w-[220px] pl-10 pr-12 py-1.5 lg:py-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-3 py-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--bg))] text-[rgb(var(--fg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] text-sm"
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="price-asc">Price (Low → High)</option>
                        <option value="price-desc">Price (High → Low)</option>
                        <option value="stock-asc">Stock (Low → High)</option>
                        <option value="stock-desc">Stock (High → Low)</option>
                        <option value="date-desc">Date (Newest → Oldest)</option>
                        <option value="date-asc">Date (Oldest → Newest)</option>
                      </select>
                    </div>

                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="px-3 py-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--bg))] text-[rgb(var(--fg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] text-sm"
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                </div>

                {/* Results info */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[rgb(var(--muted))]">
                  <span>
                    Showing {startIndex + 1}-{Math.min(endIndex, processedProducts.length)} of {processedProducts.length} products
                    {debouncedSearch && ` (filtered from ${products.length} total)`}
                  </span>
                  {hasActiveFilters && (
                    <Button onClick={handleResetFilters} variant="ghost" size="sm">
                      Reset All Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending changes */}
            {Object.keys(changes).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{Object.keys(changes).length} pending changes</Badge>
                  <span className="text-sm text-[rgb(var(--muted))]">Don't forget to save your changes</span>
                </div>
                <Button onClick={handleSubmitChanges} variant="primary" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save All Changes"}
                </Button>
              </motion.div>
            )}

            {/* Products Table */}
            <Card variant="elevated">
              <CardContent className="p-0">
                {paginatedProducts.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Package className="mx-auto mb-4 text-[rgb(var(--muted))]" size={48} />
                    <p className="text-lg text-[rgb(var(--muted))]">
                      {debouncedSearch || selectedCategories.length > 0
                        ? "No products found matching your filters"
                        : "No products available"}
                    </p>
                    <p className="text-sm text-[rgb(var(--muted))] mt-1">
                      {debouncedSearch || selectedCategories.length > 0
                        ? "Try adjusting your search or filters"
                        : "Add your first product to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">Product Name</th>
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">Price</th>
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">Stock</th>
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">Category</th>
                          <th className="text-right p-3 font-medium text-[rgb(var(--muted))]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence mode="wait">
                          {paginatedProducts.map((product, index) => {
                            const isDeleted = changes[product._id]?.deleted;
                            const stockOverride = changes[product._id]?.newStock;
                            const currentStock = stockOverride !== undefined ? stockOverride : product.stock;
                            const isNewest = newestProduct?._id === product._id;

                            return (
                              <motion.tr
                                key={product._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`relative border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--card))] transition-colors ${
                                  isDeleted ? "opacity-50 bg-red-50 dark:bg-red-900/20" : ""
                                }`}
                              >
                                <td className="p-3 align-top">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-[rgb(var(--fg))]">{product.name}</span>
                                    {isNewest && (
                                      <Badge variant="success" size="sm" className="flex items-center gap-1 animate-pulse">
                                        <Sparkles size={10} />
                                        NEW
                                      </Badge>
                                    )}
                                  </div>
                                </td>

                                <td className="p-3 align-top">
                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                    ₹{product.price?.toLocaleString()}
                                  </span>
                                </td>

                                <td className="p-3 align-top">
                                  <div className="flex items-center gap-3">
                                    {/* stock status coloring */}
                                    <span
                                      className={`font-medium ${
                                        currentStock < 10
                                          ? "text-red-600 dark:text-red-400"
                                          : currentStock < 30
                                          ? "text-yellow-600 dark:text-yellow-400"
                                          : "text-[rgb(var(--fg))]"
                                      }`}
                                    >
                                      {currentStock}
                                    </span>
                                    {currentStock < 10 && <Badge variant="danger" size="sm">Low</Badge>}
                                    {stockOverride !== undefined && <Badge variant="primary" size="sm">Modified</Badge>}
                                  </div>

                                  {/* stock controls */}
                                  <div className="mt-2 flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDecrement(product._id, currentStock)}
                                      disabled={isDeleted || currentStock <= 0}
                                      leftIcon={<Minus size={14} />}
                                    >
                                      -1
                                    </Button>
                                    <input
                                      type="number"
                                      value={currentStock}
                                      min={0}
                                      onChange={(e) => handleSetStock(product._id, Number(e.target.value))}
                                      className="w-20 px-2 py-1 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] text-sm"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleIncrement(product._id, currentStock)}
                                      disabled={isDeleted}
                                      leftIcon={<TrendingUp size={14} />}
                                    >
                                      +1
                                    </Button>
                                  </div>

                                  {/* row toast */}
                                  <div className="relative h-0">
                                    <AnimatePresence>
                                      {rowToast[product._id] && (
                                        <motion.div
                                          key={rowToast[product._id].key}
                                          variants={{
                                            initial: { opacity: 0, y: -8, scale: 0.98 },
                                            animate: {
                                              opacity: 1,
                                              y: 0,
                                              scale: 1,
                                              transition: { type: "spring", stiffness: 320, damping: 24 }
                                            },
                                            exit: {
                                              opacity: 0,
                                              y: -8,
                                              scale: 0.98,
                                              transition: { duration: 0.2, ease: "easeOut" }
                                            }
                                          }}
                                          initial="initial"
                                          animate="animate"
                                          exit="exit"
                                          className={`absolute -top-8 left-0 px-2 py-1 rounded-md text-xs font-medium shadow-md ${
                                            rowToast[product._id].delta > 0
                                              ? "bg-green-600 text-white"
                                              : "bg-red-600 text-white"
                                          }`}
                                        >
                                          {rowToast[product._id].delta > 0 ? "+1" : "-1"}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </td>

                                <td className="p-3 align-top">
                                  <Badge variant="outline" size="sm">{product.category}</Badge>
                                </td>

                                <td className="p-3 align-top">
                                  <div className="flex justify-end gap-2">
                                    {/* keep legacy +1 button if you want; the +1 button above replaces this */}
                                    {/* <Button
                                      onClick={() => handleIncrement(product._id, currentStock)}
                                      variant="outline"
                                      size="sm"
                                      disabled={isDeleted}
                                      leftIcon={<TrendingUp size={14} />}
                                    >
                                      +1
                                    </Button> */}
                                    <Button
                                      onClick={() => handleDelete(product._id)}
                                      variant={isDeleted ? "success" : "danger"}
                                      size="sm"
                                      leftIcon={isDeleted ? <Undo size={14} /> : <Trash2 size={14} />}
                                    >
                                      {isDeleted ? "Undo" : "Delete"}
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      leftIcon={<ChevronLeft size={16} />}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                          return (
                            <span key={`ellipsis-${index}`} className="px-2 text-[rgb(var(--muted))]">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page as number}
                            onClick={() => goToPage(page as number)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-[rgb(var(--ring))] text-white"
                                : "bg-[rgb(var(--card))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      rightIcon={<ChevronRight size={16} />}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:w-80 w-full lg:block fixed lg:sticky top-0 right-0 h-screen lg:h-fit z-50 lg:z-auto"
              >
                <Card variant="elevated" className="h-full lg:h-auto overflow-y-auto">
                  <CardHeader className="py-3 border-b border-[rgb(var(--border))]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="text-blue-600 dark:text-blue-400" size={20} />
                        <CardTitle className="text-base">Filters</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedCategories.length > 0 && (
                          <Badge variant="primary" size="sm">{selectedCategories.length}</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          leftIcon={<RotateCcw size={14} />}
                          className="hidden lg:flex"
                        >
                          Reset
                        </Button>
                        <button
                          onClick={() => setSidebarOpen(false)}
                          className="lg:hidden text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] p-1 transition-colors"
                          aria-label="Close filters"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    {/* Category filter */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Categories</h3>
                        {selectedCategories.length > 0 && (
                          <button
                            onClick={clearCategories}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Clear ({selectedCategories.length})
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-base cursor-pointer ${
                              selectedCategories.includes(category)
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              className="w-4 h-4 rounded border-[rgb(var(--border))] text-[rgb(var(--ring))] focus:ring-2 focus:ring-[rgb(var(--ring))] cursor-pointer"
                            />
                            <span className="flex-1">{category}</span>
                            <Badge variant="secondary" size="sm">
                              {products.filter((p) => p.category === category).length}
                            </Badge>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Date filter */}
                    <div className="pt-4 mt-6 border-t border-[rgb(var(--border))] space-y-2">
                      <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Created within</h3>
                      <div className="flex gap-2">
                        <Button
                          variant={dateFilter === "all" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => { setDateFilter("all"); setCurrentPage(1); }}
                        >
                          All
                        </Button>
                        <Button
                          variant={dateFilter === "7days" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => { setDateFilter("7days"); setCurrentPage(1); }}
                        >
                          7 days
                        </Button>
                        <Button
                          variant={dateFilter === "30days" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => { setDateFilter("30days"); setCurrentPage(1); }}
                        >
                          30 days
                        </Button>
                      </div>
                    </div>

                    {/* Active filters summary */}
                    {(selectedCategories.length > 0 || dateFilter !== "all") && (
                      <div className="pt-4 mt-6 border-t border-[rgb(var(--border))]">
                        <h3 className="text-sm font-medium text-[rgb(var(--fg))] mb-3">Active Filters</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedCategories.map((cat) => (
                            <Badge key={cat} variant="primary" size="sm">{cat}</Badge>
                          ))}
                          {dateFilter !== "all" && (
                            <Badge variant="primary" size="sm">{dateFilter}</Badge>
                          )}
                        </div>
                        <Button
                          onClick={handleResetFilters}
                          variant="outline"
                          size="sm"
                          className="w-full"
                          leftIcon={<RotateCcw size={14} />}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
