
import { ShoppingCart, CheckCircle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../redux/slices/productSlice";
import { addItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";

export default function TrendingPage() {
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(AllProducts());
    }
  }, [dispatch, products]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="app-container">
          <div className="text-center mb-12">
            <div className="skeleton skeleton--text w-33 mx-auto mb-2" />
            <div className="skeleton skeleton--text w-50 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
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

  // Trending logic: pick top 8 products (could be sorted by sales, rating, etc. Here just first 8)
  const trendingProducts = products?.slice(0, 8) || [];

  return (
    <section className="section-y px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="app-container">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[rgb(var(--fg))]">Trending Products</h2>
          <p className="text-base sm:text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
            Check out what's trending right now!
          </p>
        </div>

        {/* Trending Products Grid (smaller, consistent cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product: any) => {
            const isInCart = cartItems.some((item) => item._id === product._id);
            return (
              <div
                key={product._id}
                className="group product-card cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Product Image */}
                <div className="product-card-img">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300x225'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-base group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div
                  className="p-3 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="text-sm font-semibold line-clamp-2 text-[rgb(var(--fg))] mb-1 min-h-[36px]">
                    {product.name}
                  </h4>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400 mb-2">
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
                      className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 text-xs sm:text-sm font-medium rounded-lg cursor-default"
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

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-3 px-6 py-3 bg-[rgb(var(--fg))] text-[rgb(var(--bg))] rounded-full text-sm sm:text-base font-semibold hover:opacity-90 transition-base shadow-lg hover:shadow-xl"
          >
            <Sparkles size={18} />
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
