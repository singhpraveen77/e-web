import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios/axiosInstance";
import { AllProducts } from "../../api/products.api";
import { Package, Plus, Trash2, Undo, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../../components/ui";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

type ChangeStatus = {
  newStock?: number;
  deleted?: boolean;
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, ChangeStatus>>({});
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 👈 trigger for re-fetch

  const navigate = useNavigate();

  // 🔹 Fetch products on mount & whenever refreshTrigger changes
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
  }, [refreshTrigger]); // 👈 re-runs fetch when refreshTrigger changes

  // 🔸 Toggle delete
  const handleDelete = (id: string) => {
    const isDeleted = changes[id]?.deleted;
    setChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], deleted: !isDeleted },
    }));
  };

  // 🔸 Increment stock (+1)
  const handleUpdateStock = (id: string, stock: number) => {
    const newStock = stock + 1;
    setChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], newStock },
    }));
  };

  // 🔸 Submit changes (batch update)
  const handleSubmitChanges = async () => {
    try {
      setSaving(true);

      const updatedStocks: Record<string, number> = {};
      const deleted: string[] = [];

      for (const [id, change] of Object.entries(changes)) {
        if (change.deleted) deleted.push(id);
        else if (change.newStock !== undefined)
          updatedStocks[id] = change.newStock;
      }

      await axiosInstance.post("/admin/product/batch-update", {
        updatedStocks,
        deleted,
      });

      alert("✅ Changes saved successfully!");
      setChanges({});
      setRefreshTrigger((prev) => !prev); // 👈 triggers automatic refetch

    } catch (err: any) {
      console.error("Error saving changes:", err);
      alert("❌ Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="app-container py-8">
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-[rgb(var(--muted))]" size={48} />
          <p className="text-lg text-[rgb(var(--muted))]">Loading products...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
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

  return (
    <div className="app-container py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 dark:bg-green-500 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--fg))]">Products Management</h1>
              <p className="text-sm text-[rgb(var(--muted))]">Manage your product inventory and stock</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/admin/products/addProducts")}
            variant="primary"
            leftIcon={<Plus size={16} />}
          >
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Inventory</CardTitle>
              {Object.keys(changes).length > 0 && (
                <Badge variant="secondary">
                  {Object.keys(changes).length} pending changes
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgb(var(--border))]">
                    <th className="text-left p-3 text-sm font-medium text-[rgb(var(--muted))]">Product Name</th>
                    <th className="text-left p-3 text-sm font-medium text-[rgb(var(--muted))]">Price</th>
                    <th className="text-left p-3 text-sm font-medium text-[rgb(var(--muted))]">Stock</th>
                    <th className="text-left p-3 text-sm font-medium text-[rgb(var(--muted))]">Category</th>
                    <th className="text-right p-3 text-sm font-medium text-[rgb(var(--muted))]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const isDeleted = changes[product._id]?.deleted;
                    const stockOverride = changes[product._id]?.newStock;
                    const currentStock = stockOverride !== undefined ? stockOverride : product.stock;

                    return (
                      <tr 
                        key={product._id} 
                        className={`border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--card))] transition-colors ${
                          isDeleted ? 'opacity-50 bg-red-50 dark:bg-red-900/20' : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-medium text-[rgb(var(--fg))]">{product.name}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-green-600 dark:text-green-400">₹{product.price?.toLocaleString()}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              currentStock < 10 ? 'text-red-600 dark:text-red-400' : 'text-[rgb(var(--fg))]'
                            }`}>
                              {currentStock}
                            </span>
                            {stockOverride !== undefined && (
                              <Badge variant="primary" size="sm">Modified</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" size="sm">{product.category}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() =>
                                handleUpdateStock(
                                  product._id,
                                  stockOverride ?? product.stock
                                )
                              }
                              variant="outline"
                              size="sm"
                              disabled={isDeleted}
                              leftIcon={<TrendingUp size={14} />}
                            >
                              +1 Stock
                            </Button>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto mb-4 text-[rgb(var(--muted))]" size={48} />
                  <p className="text-lg text-[rgb(var(--muted))]">No products available</p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">Add your first product to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {Object.keys(changes).length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitChanges}
              variant="primary"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save All Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>

  );
};

export default ProductsPage;
