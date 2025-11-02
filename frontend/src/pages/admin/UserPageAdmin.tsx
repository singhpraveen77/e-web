import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios/axiosInstance";
import {
  Users,
  UserCheck,
  Shield,
  Trash2,
  Undo,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../../components/ui";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

type ChangeStatus = {
  newRole?: "user" | "admin";
  deleted?: boolean;
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc"
  | "role-asc"
  | "role-desc"
  | "date-asc"
  | "date-desc";

type DateFilter = "all" | "7days" | "30days";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, ChangeStatus>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // sort
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // filters
  const [selectedRoles, setSelectedRoles] = useState<Array<"user" | "admin">>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // lock scroll when sidebar open (mobile)
  useEffect(() => {
    if (sidebarOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [sidebarOpen]);

  // fetch users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("/admin/users");
        const fetched: User[] =
          res?.data?.data?.map((item: any) => ({
            _id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
            createdAt: item.createdAt
          })) ?? [];
        setUsers(fetched);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    getAllUsers();
  }, [refreshTrigger]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // newest user for NEW badge
  const newestUser = useMemo(() => {
    if (users.length === 0) return null;
    return [...users].sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return db - da;
    })[0];
  }, [users]);

  // date filter helper
  const filterByDate = (u: User) => {
    if (dateFilter === "all") return true;
    const d = new Date(u.createdAt || 0);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (dateFilter === "7days") return diffDays <= 7;
    if (dateFilter === "30days") return diffDays <= 30;
    return true;
  };

  // processing pipeline: search -> role filter -> date filter -> sort
  const processedUsers = useMemo(() => {
    let filtered = users;

    // search on name or email
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }

    // role filter
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((u) => selectedRoles.includes(u.role));
    }

    // date filter
    filtered = filtered.filter(filterByDate);

    // sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "email-asc":
          return a.email.localeCompare(b.email);
        case "email-desc":
          return b.email.localeCompare(a.email);
        case "role-asc":
          return a.role.localeCompare(b.role);
        case "role-desc":
          return b.role.localeCompare(a.role);
        case "date-asc":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "date-desc":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, debouncedSearch, selectedRoles, dateFilter, sortBy]);

  // pagination
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginated = processedUsers.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  };
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
  };

  // reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("date-desc");
    setSelectedRoles([]);
    setDateFilter("all");
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  // role filter handlers
  const toggleRole = (role: "user" | "admin") => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    setCurrentPage(1);
  };
  const clearRoles = () => {
    setSelectedRoles([]);
    setCurrentPage(1);
  };

  // actions
  const handleToggleRole = (id: string, currentRole: "user" | "admin") => {
    const next = currentRole === "admin" ? "user" : "admin";
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: next } : u)));
    setChanges((prev) => ({ ...prev, [id]: { ...prev[id], newRole: next } }));
  };

  const handleDelete = (id: string) => {
    const isDeleted = changes[id]?.deleted;
    if (!isDeleted) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setChanges((prev) => ({ ...prev, [id]: { ...prev[id], deleted: true } }));
    } else {
      setChanges((prev) => {
        const { deleted, ...rest } = prev[id] || {};
        return { ...prev, [id]: rest };
      });
    }
  };

  const handleSubmitChanges = async () => {
    try {
      setSaving(true);
      const updatedRoles: Record<string, "user" | "admin"> = {};
      const deleted: string[] = [];
      for (const [id, change] of Object.entries(changes)) {
        if (change.deleted) deleted.push(id);
        else if (change.newRole) updatedRoles[id] = change.newRole;
      }
      await axiosInstance.post("/admin/users/batch-update", { updatedRoles, deleted });
      alert("✅ Changes saved successfully!");
      setChanges({});
      setRefreshTrigger((p) => !p);
    } catch (e) {
      alert("❌ Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const hasActiveFilters =
    searchQuery ||
    sortBy !== "date-desc" ||
    selectedRoles.length > 0 ||
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
                    {Array.from({ length: 4 }).map((_, i) => (
                      <th key={i} className="text-left p-2 sm:p-3">
                        <div className="skeleton skeleton--text w-50" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, r) => (
                    <tr key={r} className="border-b border-[rgb(var(--border))]">
                      {Array.from({ length: 4 }).map((_, c) => (
                        <td key={c} className="p-2 sm:p-3">
                          <div
                            className={`skeleton skeleton--text ${
                              ["w-75", "w-50", "w-66", "w-33"][(r + c) % 4]
                            }`}
                          />
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
    ); // debounced UX skeleton pattern is standard for responsive lists [web:23].
  }

  if (error) {
    return (
      <div className="app-container py-8">
        <Card variant="outlined" className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">
              <Users size={32} className="mx-auto" />
            </div>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    ); // keep error state consistent with data table pages [web:2].
  }

  return (
    <div className="app-container py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--fg))]">User Management</h1>
              <p className="text-sm text-[rgb(var(--muted))]">Manage user accounts and permissions</p>
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
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Search + Sort + ItemsPerPage */}
            <Card className="bg-transparent border-none p-0">
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search name or email..."
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

                  {/* sort + ipp */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-3 py-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--bg))] text-[rgb(var(--fg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] text-sm"
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="email-asc">Email (A-Z)</option>
                        <option value="email-desc">Email (Z-A)</option>
                        <option value="role-asc">Role (A-Z)</option>
                        <option value="role-desc">Role (Z-A)</option>
                        <option value="date-desc">Date (Newest → Oldest)</option>
                        <option value="date-asc">Date (Oldest → Newest)</option>
                      </select>
                    </div>

                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
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
                    Showing {startIndex + 1}-{Math.min(endIndex, processedUsers.length)} of {processedUsers.length} users
                    {debouncedSearch && ` (filtered from ${users.length} total)`}
                  </span>
                  {hasActiveFilters && (
                    <Button onClick={handleResetFilters} variant="ghost" size="sm">
                      Reset All Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending changes banner */}
            {Object.keys(changes).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{Object.keys(changes).length} pending changes</Badge>
                  <span className="text-sm text-[rgb(var(--muted))]">Don’t forget to save your changes</span>
                </div>
                <Button onClick={handleSubmitChanges} variant="primary" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save All Changes"}
                </Button>
              </motion.div>
            )}

            {/* Users table */}
            <Card variant="elevated">
              <CardContent className="p-0">
                {paginated.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Users className="mx-auto mb-4 text-[rgb(var(--muted))]" size={48} />
                    <p className="text-lg text-[rgb(var(--muted))]">
                      {debouncedSearch || selectedRoles.length > 0
                        ? "No users found matching your filters"
                        : "No users available"}
                    </p>
                    <p className="text-sm text-[rgb(var(--muted))] mt-1">
                      {debouncedSearch || selectedRoles.length > 0
                        ? "Try adjusting your search or filters"
                        : "Users will appear here when they sign up"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">User</th>
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">Email</th>
                          <th className="text-left p-3 font-medium text-[rgb(var(--muted))]">Role</th>
                          <th className="text-right p-3 font-medium text-[rgb(var(--muted))]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence mode="wait">
                          {paginated.map((user, idx) => {
                            const isDeleted = changes[user._id]?.deleted;
                            const hasRoleChange = changes[user._id]?.newRole;
                            const isNewest = newestUser?._id === user._id;
                            return (
                              <motion.tr
                                key={user._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                className={`border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--card))] transition-colors ${
                                  isDeleted ? "opacity-50 bg-red-50 dark:bg-red-900/20" : ""
                                }`}
                              >
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-[rgb(var(--fg))]">{user.name}</span>
                                    {isNewest && (
                                      <Badge variant="success" size="sm" className="flex items-center gap-1 animate-pulse">
                                        <Sparkles size={10} />
                                        NEW
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className="text-[rgb(var(--muted))]">{user.email}</span>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={user.role === "admin" ? "primary" : "secondary"} size="sm">
                                      {user.role === "admin" ? (
                                        <>
                                          <Shield size={12} className="mr-1" />
                                          Admin
                                        </>
                                      ) : (
                                        "User"
                                      )}
                                    </Badge>
                                    {hasRoleChange && <Badge variant="primary" size="sm">Modified</Badge>}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      onClick={() => handleToggleRole(user._id, user.role)}
                                      variant="outline"
                                      size="sm"
                                      disabled={isDeleted}
                                      leftIcon={user.role === "admin" ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                                    >
                                      {user.role === "admin" ? "Make User" : "Make Admin"}
                                    </Button>
                                    <Button
                                      onClick={() => handleDelete(user._id)}
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
              <Card variant="outlined">
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

          {/* Right sidebar filters */}
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
                        {selectedRoles.length > 0 && (
                          <Badge variant="primary" size="sm">
                            {selectedRoles.length}
                          </Badge>
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
                    {/* Role filter */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Roles</h3>
                        {selectedRoles.length > 0 && (
                          <button
                            onClick={clearRoles}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Clear ({selectedRoles.length})
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(["admin", "user"] as Array<"admin" | "user">).map((role) => (
                          <label
                            key={role}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-base cursor-pointer ${
                              selectedRoles.includes(role)
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedRoles.includes(role)}
                              onChange={() => toggleRole(role)}
                              className="w-4 h-4 rounded border-[rgb(var(--border))] text-[rgb(var(--ring))] focus:ring-2 focus:ring-[rgb(var(--ring))] cursor-pointer"
                            />
                            <span className="flex-1 capitalize">{role}</span>
                            <Badge variant="secondary" size="sm">
                              {users.filter((u) => u.role === role).length}
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
                          onClick={() => {
                            setDateFilter("all");
                            setCurrentPage(1);
                          }}
                        >
                          All
                        </Button>
                        <Button
                          variant={dateFilter === "7days" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => {
                            setDateFilter("7days");
                            setCurrentPage(1);
                          }}
                        >
                          7 days
                        </Button>
                        <Button
                          variant={dateFilter === "30days" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => {
                            setDateFilter("30days");
                            setCurrentPage(1);
                          }}
                        >
                          30 days
                        </Button>
                      </div>
                    </div>

                    {/* Active filters summary */}
                    {(selectedRoles.length > 0 || dateFilter !== "all") && (
                      <div className="pt-4 mt-6 border-t border-[rgb(var(--border))]">
                        <h3 className="text-sm font-medium text-[rgb(var(--fg))] mb-3">Active Filters</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedRoles.map((r) => (
                            <Badge key={r} variant="primary" size="sm">
                              {r}
                            </Badge>
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

      {/* Mobile backdrop */}
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

export default UsersPage;
