import React from "react";
import { Filter, RotateCcw, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../components/ui";

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
  { value: "All", label: "All Categories", icon: "🛍️" },
  { value: "laptop", label: "Laptops", icon: "💻" },
  { value: "mobile", label: "Mobiles", icon: "📱" },
  { value: "watch", label: "Watches", icon: "⌚" },
  { value: "camera", label: "Cameras", icon: "📸" },
  { value: "headphone", label: "Headphones", icon: "🎧" },
  { value: "tablet", label: "Tablets", icon: "📱" },
  { value: "accessories", label: "Accessories", icon: "🔌" },
  { value: "other", label: "Others", icon: "📦" },
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
  const activeFiltersCount = [
    category !== "All",
    rating > 0,
    price < maxPrice
  ].filter(Boolean).length;

  return (
    <div className="w-full md:w-80 space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="text-blue-600 dark:text-blue-400" size={20} />
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Price Range</h3>
              <span className="text-xs text-[rgb(var(--muted))]">₹{price?.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-[rgb(var(--border))] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${(price / maxPrice) * 100}%, rgb(var(--border)) ${(price / maxPrice) * 100}%, rgb(var(--border)) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-[rgb(var(--muted))]">
              <span>₹0</span>
              <span>₹{maxPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(isActive && cat.value !== "All" ? "All" : cat.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-base text-left ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="flex-1">{cat.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Minimum Rating</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(rating === star ? 0 : star)}
                  className={`p-1 rounded transition-base ${
                    rating >= star 
                      ? "text-yellow-400 scale-110" 
                      : "text-[rgb(var(--border))] hover:text-yellow-300"
                  }`}
                  aria-label={`${star} star${star !== 1 ? 's' : ''} minimum`}
                >
                  <Star size={20} className={rating >= star ? "fill-current" : ""} />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-xs text-[rgb(var(--muted))]">& up</span>
              )}
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw size={14} />}
              className="w-full"
            >
              Reset Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Mobile Filter Summary */}
      {activeFiltersCount > 0 && (
        <Card className="md:hidden">
          <CardContent className="flex flex-wrap gap-2 p-3">
            {category !== "All" && (
              <Badge variant="primary" size="sm">
                {categories.find(c => c.value === category)?.label}
              </Badge>
            )}
            {rating > 0 && (
              <Badge variant="secondary" size="sm">
                {rating}+ ★
              </Badge>
            )}
            {price < maxPrice && (
              <Badge variant="outline" size="sm">
                ≤ ₹{price?.toLocaleString()}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductFilters;
