import React, { useState } from "react";
// import axios from "axios";
import { getNextProduct } from "../dataSet/RandomData";
import { AllProducts } from "../redux/slices/productSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
// import { useTheme } from "../context/ThemeContext";
import { AddProductapi } from "../api/products.api";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
}

const categories = [
  "laptop",
  "mobile",
  "watch",
  "camera",
  "headphone",
  "tablet",
  "accessories",
  "other",
];

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 1,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  // const { resolvedTheme } = useTheme();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const RandomFill = () => {
    const rd_product = getNextProduct();
    setFormData({ ...rd_product, images: [] });
    setMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Create FormData object
      const data = new FormData();
      
      // Append regular fields
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("category", formData.category);
      data.append("stock", String(formData.stock));
      
      // Append multiple images
      formData.images.forEach((file) => {
        data.append("images", file);
      });


      const res = await AddProductapi(data);

      setMessage("✅ Product added successfully!");
      console.log("Product Created:", res);
      
      // Refresh products list
      dispatch(AllProducts());

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 1,
        images: [],
      });
      
      // Reset file input
      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error("❌ Error adding product:", error);
      const errorMessage = error.response?.data?.message || "Failed to add product";
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        max-w-lg mx-auto mt-10 p-6
        rounded-2xl shadow-lg border
        border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900/90
        text-gray-800 dark:text-gray-100
        backdrop-blur-md
        transition-colors duration-300
      "
    >
      <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100">
        Add New Product
      </h2>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.startsWith("✅")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="
              w-full p-2.5 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
              transition-all duration-200
            "
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            className="
              w-full p-2.5 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="
              w-full p-2.5 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="
              w-full p-2.5 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock (Quantity)
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="
              w-full p-2.5 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Images
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="
              w-full p-2.5 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-1/2 py-2.5 rounded-lg font-medium
              bg-green-600 hover:bg-green-700
              disabled:opacity-70
              text-white transition-colors
            "
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          <button
            type="button"
            onClick={RandomFill}
            className="
              w-full sm:w-1/2 py-2.5 rounded-lg font-medium
              bg-indigo-600 hover:bg-indigo-700
              text-white transition-colors
            "
          >
            Fill Random Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
