import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios/axiosInstance";
import { AllProducts } from "../../api/products.api";
import { pre } from "framer-motion/client";

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-20">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Products Management</h2>
    <button
      onClick={() => navigate("/admin/products/addProducts")}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      + Add Product
    </button>
  </div>

  <div className="border rounded">
    {/* Table header */}
    <table className="w-full table-fixed border-collapse">
      <thead className="bg-gray-200 sticky top-0 z-10">
        <tr>
          <th className="p-2">Name</th>
          <th className="p-2">Price</th>
          <th className="p-2">Stock</th>
          <th className="p-2">Category</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
    </table>

    {/* Scrollable table body */}
    <div className="overflow-y-auto max-h-96">
      <table className="w-full table-fixed border-collapse">
        <tbody>
          {products.map((product) => {
            const isDeleted = changes[product._id]?.deleted;
            const stockOverride = changes[product._id]?.newStock;

            return (
              <tr key={product._id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">${product.price}</td>
                <td className="p-2">
                  {stockOverride !== undefined ? stockOverride : product.stock}
                </td>
                <td className="p-2">{product.category}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateStock(
                        product._id,
                        stockOverride ?? product.stock
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    disabled={isDeleted}
                  >
                    + Stock
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className={`px-3 py-1 rounded ${
                      isDeleted ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {isDeleted ? "Undo Delete" : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  <div className="mt-6 flex justify-end">
    <button
      onClick={handleSubmitChanges}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      disabled={Object.keys(changes).length === 0 || saving}
    >
      {saving ? "Saving..." : "Make Changes"}
    </button>
  </div>
</div>

  );
};

export default ProductsPage;
