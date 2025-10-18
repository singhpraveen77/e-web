import React, { useState } from "react";
import { Star } from "lucide-react";
import { getNextProduct } from "../dataSet/RandomData";
import { AllProducts } from "../redux/slices/productSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { AddProductapi } from "../api/products.api";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
  rating: number;
}

const categories = [
  "laptop", "mobile", "tablet", "camera", "headphone", "watch",
  "smart-devices", "audio-equipment", "mens-clothing", "womens-clothing",
  "shoes", "jewelry", "accessories", "supplements", "fitness-equipment",
  "wellness-products", "skincare", "cosmetics", "grooming", "furniture",
  "home-decor", "kitchen-appliances", "home-textiles", "groceries",
  "specialty-foods", "beverages", "sports-gear", "athletic-wear",
  "exercise-equipment", "other",
];

// Optimized Star Rating Component
const StarRatingInput: React.FC<{
  value: number;
  onChange: (rating: number) => void;
}> = ({ value, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || value;

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const colors = ["", "red", "orange", "yellow", "lime", "green"];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform duration-100 hover:scale-110 cursor-pointer"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={26}
                className={`transition-colors duration-100 ${
                  star <= displayRating
                    ? "fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500"
                    : "fill-transparent text-gray-300 dark:text-gray-600"
                }`}
                strokeWidth={2}
              />
            </button>
          ))}
        </div>

        {/* Numeric Display */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
          {value}/5
        </span>
      </div>

      {/* Rating Label with Progress Bar */}
      {displayRating > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ease-out bg-${colors[displayRating]}-500`}
              style={{
                width: `${(displayRating / 5) * 100}%`,
                backgroundColor: displayRating === 1 ? '#ef4444' :
                                displayRating === 2 ? '#f97316' :
                                displayRating === 3 ? '#eab308' :
                                displayRating === 4 ? '#84cc16' : '#22c55e'
              }}
            />
          </div>
          <span 
            className="text-xs font-semibold min-w-[75px] transition-colors duration-100"
            style={{
              color: displayRating === 1 ? '#ef4444' :
                     displayRating === 2 ? '#f97316' :
                     displayRating === 3 ? '#eab308' :
                     displayRating === 4 ? '#84cc16' : '#22c55e'
            }}
          >
            {labels[displayRating]}
          </span>
        </div>
      )}
    </div>
  );
};

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 1,
    images: [],
    rating: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

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
      const data = new FormData();
      
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("category", formData.category);
      data.append("stock", String(formData.stock));
      data.append("rating", String(formData.rating));
      
      formData.images.forEach((file) => {
        data.append("images", file);
      });

      const res = await AddProductapi(data);

      setMessage("✅ Product added successfully!");
      console.log("Product Created:", res);
      
      dispatch(AllProducts());

      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 1,
        images: [],
        rating: 0,
      });
      
      const fileInput = document.getElementById("images") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      console.error("❌ Error adding product:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add product";
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 text-gray-800 dark:text-gray-100 backdrop-blur-md transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100">
        Add New Product
      </h2>

      {message && (
        <p className={`mb-4 text-sm font-medium ${message.startsWith("✅") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
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
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1">Stock (Quantity)</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Rating - Optimized */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Rating</label>
          <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <StarRatingInput
              value={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            id="images"
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900"
          />
          {formData.images.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.images.length} file(s) selected
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-1/2 py-2.5 rounded-lg font-medium bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white transition-colors"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          <button
            type="button"
            onClick={RandomFill}
            className="w-full sm:w-1/2 py-2.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Fill Random Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
