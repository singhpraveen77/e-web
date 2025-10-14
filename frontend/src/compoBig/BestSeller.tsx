import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import type { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../redux/slices/productSlice";
import { addItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function BestSeller() {
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const cartItems = useSelector((state: RootState) => state.cart.products);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="app-container">
          <div className="animate-pulse">
            <div className="h-8 bg-[rgb(var(--border))] rounded w-48 mb-8"></div>
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 min-w-[280px]">
                  <div className="aspect-[4/5] bg-[rgb(var(--border))] rounded mb-4"></div>
                  <div className="h-4 bg-[rgb(var(--border))] rounded mb-2"></div>
                  <div className="h-6 bg-[rgb(var(--border))] rounded mb-4 w-24"></div>
                  <div className="h-10 bg-[rgb(var(--border))] rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="app-container text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load bestsellers</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--bg))] relative">
      <div className="app-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 sm:mb-12">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-orange-500" size={28} />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[rgb(var(--fg))]">Best Sellers</h2>
            </div>
            <p className="text-[rgb(var(--muted))] text-sm sm:text-base">Most popular products loved by our customers</p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-base group"
          >
            View All Products
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Scroll Controls */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] hover:shadow-md transition-base text-[rgb(var(--fg))]"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] hover:shadow-md transition-base text-[rgb(var(--fg))]"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Product Grid */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 sm:space-x-6 scroller-hidden scroll-smooth pb-2"
        >
          {products && products.length !== 0 ? (
            products.slice(0, 8).map((product: any) => {
              const isInCart = cartItems.some(
                (item) => item._id === product._id
              );

              return (
                <div
                  key={product._id}
                  className="group min-w-[280px] sm:min-w-[320px] card overflow-hidden hover:shadow-lg transition-base cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[rgb(var(--card))]">
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/320x400'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-base group-hover:scale-105"
                    />
                    {/* Bestseller Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        <Star size={12} className="fill-current" />
                        Bestseller
                      </div>
                    </div>
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-base flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <ShoppingCart size={20} className="text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div
                    className="p-5 flex flex-col h-32"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-base font-semibold line-clamp-2 text-[rgb(var(--fg))] mb-2 flex-1">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{product.price?.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-[rgb(var(--muted))]">4.8</span>
                      </div>
                    </div>

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
                        className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 text-sm font-medium rounded-lg cursor-default"
                      >
                        <CheckCircle size={16} />
                        In Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center py-12 text-[rgb(var(--muted))]">No bestsellers found</div>
          )}
        </div>
      </div>
    </section>
  );
}
