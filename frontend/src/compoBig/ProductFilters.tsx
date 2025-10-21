import React, { useState } from "react";
import { Filter, RotateCcw, Star, ChevronDown, ChevronRight } from "lucide-react";
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

// *** ADD TYPE DEFINITIONS ***
export interface Subcategory {
  value: string;
  label: string;
  icon: string;
}

export interface Category {
  value: string;
  label: string;
  icon: string;
  subcategories: Subcategory[];
}

// *** EXPORT WITH PROPER TYPE ***
export const categories: Category[] = [
  {
    value: "electronics",
    label: "Electronics & Gadgets",
    icon: "💻",
    subcategories: [
      { value: "laptop", label: "Laptops", icon: "💻" },
      { value: "mobile", label: "Mobiles", icon: "📱" },
      { value: "tablet", label: "Tablets", icon: "📱" },
      { value: "camera", label: "Cameras", icon: "📸" },
      { value: "headphone", label: "Headphones", icon: "🎧" },
      { value: "watch", label: "Watches", icon: "⌚" },
      { value: "smart-devices", label: "Smart Devices", icon: "🏠" },
      { value: "audio-equipment", label: "Audio Equipment", icon: "🔊" },
    ],
  },
  {
    value: "fashion",
    label: "Fashion & Apparel",
    icon: "👔",
    subcategories: [
      { value: "mens-clothing", label: "Men's Clothing", icon: "👔" },
      { value: "womens-clothing", label: "Women's Clothing", icon: "👗" },
      { value: "shoes", label: "Shoes", icon: "👟" },
      { value: "jewelry", label: "Jewelry", icon: "💍" },
      { value: "accessories", label: "Accessories", icon: "👜" },
    ],
  },
  {
    value: "health-wellness",
    label: "Health & Wellness",
    icon: "💊",
    subcategories: [
      { value: "supplements", label: "Supplements", icon: "💊" },
      { value: "fitness-equipment", label: "Fitness Equipment", icon: "🏋️" },
      { value: "wellness-products", label: "Wellness Products", icon: "🧘" },
    ],
  },
  {
    value: "beauty",
    label: "Beauty & Personal Care",
    icon: "💄",
    subcategories: [
      { value: "skincare", label: "Skincare", icon: "🧴" },
      { value: "cosmetics", label: "Cosmetics", icon: "💄" },
      { value: "grooming", label: "Grooming", icon: "💈" },
    ],
  },
  {
    value: "home-furniture",
    label: "Home & Furniture",
    icon: "🛋️",
    subcategories: [
      { value: "furniture", label: "Furniture", icon: "🛋️" },
      { value: "home-decor", label: "Home Decor", icon: "🖼️" },
      { value: "kitchen-appliances", label: "Kitchen Appliances", icon: "🍳" },
      { value: "home-textiles", label: "Home Textiles", icon: "🛏️" },
    ],
  },
  {
    value: "food-beverages",
    label: "Food & Beverages",
    icon: "🍕",
    subcategories: [
      { value: "groceries", label: "Groceries", icon: "🛒" },
      { value: "specialty-foods", label: "Specialty Foods", icon: "🧀" },
      { value: "beverages", label: "Beverages", icon: "☕" },
    ],
  },
  {
    value: "sports-fitness",
    label: "Sports & Fitness",
    icon: "⚽",
    subcategories: [
      { value: "sports-gear", label: "Sports Gear", icon: "⚽" },
      { value: "athletic-wear", label: "Athletic Wear", icon: "👕" },
      { value: "exercise-equipment", label: "Exercise Equipment", icon: "🏋️" },
    ],
  },
  {
    value: "other",
    label: "Others",
    icon: "📦",
    subcategories: [],
  },
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryValue: string): void => {
    setExpandedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const isCategoryActive = (cat: Category): boolean => {
    if (category === cat.value) return true;
    return cat.subcategories.some((sub) => sub.value === category);
  };

  const getActiveCategoryLabel = (): string => {
    if (category === "All") return "All Categories";
    
    for (const cat of categories) {
      if (cat.value === category) return cat.label;
      const subcat = cat.subcategories.find((sub) => sub.value === category);
      if (subcat) return subcat.label;
    }
    return category;
  };

  const activeFiltersCount = [
    category !== "All",
    rating > 0,
    price < maxPrice
  ].filter(Boolean).length;

  return (
    <div className="w-full md:w-80">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 my-3">
              <Filter className="text-blue-600 dark:text-blue-400" size={20} />
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw size={14} />}
              className="hover:bg-orange-800"
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="w-full">
          {/* Price Range Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
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
            <div className="flex justify-between text-xs text-[rgb(var(--muted))] mt-1">
              <span>₹0</span>
              <span>₹{maxPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* Nested Category Filter */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-[rgb(var(--fg))]">Categories</h3>
            
            {/* All Categories Option */}
            <button
              onClick={() => setCategory("All")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-base text-left ${
                category === "All"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
              }`}
            >
              <span className="text-base">🛍️</span>
              <span className="flex-1">All Categories</span>
              {category === "All" && (
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            {/* Nested Categories */}
            <div className="space-y-1">
              {categories.map((cat) => {
                const isExpanded = expandedCategories.includes(cat.value);
                const isActive = isCategoryActive(cat);
                const hasSubcategories = cat.subcategories.length > 0;

                return (
                  <div key={cat.value}>
                    {/* Parent Category */}
                    <div className="flex items-center gap-1">
                      {hasSubcategories && (
                        <button
                          onClick={() => toggleCategory(cat.value)}
                          className="p-1 hover:bg-[rgb(var(--card))] rounded transition-base"
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.label}`}
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} className="text-[rgb(var(--muted))]" />
                          ) : (
                            <ChevronRight size={16} className="text-[rgb(var(--muted))]" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => setCategory(cat.value)}
                        className={`flex-1 flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-base text-left ${
                          category === cat.value
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                            : isActive
                            ? "bg-blue-50/50 dark:bg-blue-900/10 text-[rgb(var(--fg))]"
                            : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="flex-1">{cat.label}</span>
                        {category === cat.value && (
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                        )}
                      </button>
                    </div>

                    {/* Subcategories */}
                    {isExpanded && hasSubcategories && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-[rgb(var(--border))] pl-2">
                        {cat.subcategories.map((subcat) => {
                          const isSubActive = category === subcat.value;
                          return (
                            <button
                              key={subcat.value}
                              onClick={() => setCategory(subcat.value)}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-base text-left ${
                                isSubActive
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                  : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
                              }`}
                            >
                              <span className="text-sm">{subcat.icon}</span>
                              <span className="flex-1">{subcat.label}</span>
                              {isSubActive && (
                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
              
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Filter Summary */}
      {activeFiltersCount > 0 && (
        <Card className="md:hidden mt-4">
          <CardContent className="flex flex-wrap gap-2 p-3">
            {category !== "All" && (
              <Badge variant="primary" size="sm">
                {getActiveCategoryLabel()}
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
