import { ShoppingCart, CheckCircle, Sparkles, Grid3X3 } from "lucide-react";
import { useEffect, useMemo } from "react";
import type { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../redux/slices/productSlice";
import { addItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

// Category configurations with icons and colors
const categoryConfig = {
  laptop: { label: "Laptops", icon: "💻", color: "bg-blue-500" },
  mobile: { label: "Mobiles", icon: "📱", color: "bg-green-500" },
  watch: { label: "Watches", icon: "⌚", color: "bg-purple-500" },
  camera: { label: "Cameras", icon: "📸", color: "bg-red-500" },
  headphone: { label: "Headphones", icon: "🎧", color: "bg-orange-500" },
  tablet: { label: "Tablets", icon: "💻", color: "bg-indigo-500" },
  accessories: { label: "Accessories", icon: "🔌", color: "bg-gray-500" },
  other: { label: "Others", icon: "📦", color: "bg-gray-600" }
};

export default function ShopbyCategory() {
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const cartItems = useSelector((state: RootState) => state.cart.products);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        await dispatch(AllProducts());
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };
    if (!products || products.length === 0) getAllProducts();
  }, []);

  // Group products by category
  const productsByCategory = useMemo(() => {
    if (!products) return {};
    const grouped: { [key: string]: any[] } = {};
    products.forEach((product: any) => {
      const category = product.category?.toLowerCase() || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(product);
    });
    return grouped;
  }, [products]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="app-container">
          <div className="animate-pulse text-center mb-12">
            <div className="h-8 bg-[rgb(var(--border))] rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-[rgb(var(--border))] rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-5">
                <div className="aspect-square bg-[rgb(var(--border))] rounded mb-4"></div>
                <div className="h-4 bg-[rgb(var(--border))] rounded mb-2"></div>
                <div className="h-6 bg-[rgb(var(--border))] rounded mb-4 w-24"></div>
                <div className="h-10 bg-[rgb(var(--border))] rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="app-container text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load products</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--card))]">
      <div className="app-container">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Grid3X3 className="text-purple-500" size={32} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgb(var(--fg))]">Shop by Category</h2>
          </div>
          <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
            Discover our diverse collection of products across different categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="space-y-12 sm:space-y-16">
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
            
            return (
              <div key={category} className="">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center text-white text-xl`}>
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[rgb(var(--fg))]">{config.label}</h3>
                    <p className="text-[rgb(var(--muted))]">{categoryProducts.length} products</p>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => navigate(`/products?category=${category}`)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-base"
                    >
                      View All
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {categoryProducts.slice(0, 5).map((product: any) => {
                    const isInCart = cartItems.some((item) => item._id === product._id);

                    return (
                      <div
                        key={product._id}
                        className="group card overflow-hidden hover:shadow-lg transition-base cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-[rgb(var(--bg))]">
                          <img
                            src={product.images[0]?.url || 'https://via.placeholder.com/300x300'}
                            alt={product.name}
                            className="h-full w-full object-cover transition-base group-hover:scale-105"
                          />
                          {/* Category Badge */}
                          <div className="absolute top-3 right-3">
                            <div className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center text-sm`}>
                              {config.icon}
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div
                          className="p-4 flex flex-col"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h4 className="text-sm font-semibold line-clamp-2 text-[rgb(var(--fg))] mb-2 min-h-[40px]">
                            {product.name}
                          </h4>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                            ₹{product.price?.toLocaleString()}
                          </p>

                          {!isInCart ? (
                            <button
                              onClick={() =>
                                dispatch(
                                  addItem({
                                    _id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.images[0]?.url,
                                    quantity: 1,
                                  })
                                )
                              }
                              className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                            >
                              <ShoppingCart size={14} />
                              Add to Cart
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 text-sm font-medium rounded-lg cursor-default"
                            >
                              <CheckCircle size={14} />
                              In Cart
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[rgb(var(--fg))] text-[rgb(var(--bg))] rounded-full font-semibold hover:opacity-90 transition-base shadow-lg hover:shadow-xl"
          >
            <Sparkles size={20} />
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
}
