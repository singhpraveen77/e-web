import React from "react";

interface ProductFiltersProps {
  maxPrice: number;
  price: number;
  setPrice: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  rating: number;
  setRating: (value: number) => void;
  resetFilters: () => void;
}

const categories = [
  "All",
  "laptop",
  "mobile",
  "watch",
  "camera",
  "headphone",
  "tablet",
  "accessories",
  "other",
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  maxPrice,
  price,
  setPrice,
  category,
  setCategory,
  rating,
  setRating,
  resetFilters,
}) => {
  return (
    <aside className="md:w-1/4 bg-white rounded-2xl shadow-md p-6 h-fit">
      {/* Price Filter */}
      <h2 className="text-lg font-semibold mb-4">Price Range</h2>
      <input
        type="range"
        min={0}
        max={maxPrice}
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-gray-600 text-sm mt-1">
        <span>₹0</span>
        <span>₹{price || maxPrice}</span>
      </div>

      {/* Category Filter */}
      <h2 className="text-lg font-semibold mt-6 mb-3">Categories</h2>
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? "All" : cat)}
            className={`text-left px-3 py-1 rounded-md transition ${
              category === cat
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rating Filter */}
      <h2 className="text-lg font-semibold mt-6 mb-3">Minimum Rating</h2>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(rating === star ? 0 : star)}
            className={`text-2xl ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="mt-6 w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
      >
        Reset All Filters
      </button>
    </aside>
  );
};

export default ProductFilters;
