import {
  ShoppingCart,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
} from "lucide-react";
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
    if (!products || products.length === 0) {
      dispatch(AllProducts()).catch((err) =>
        console.log("Error fetching products:", err)
      );
    }
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

  if (loading)
    return (
      <section className="py-16 px-6 lg:px-10">
        <div className="animate-pulse flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="min-w-[280px] h-[380px] bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))]"
            ></div>
          ))}
        </div>
      </section>
    );

  if (error)
    return (
      <section className="py-16 text-center text-red-500">
        Failed to load best sellers.
      </section>
    );

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                <TrendingUp className="text-orange-500" size={24} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--fg))]">
                Best Sellers
              </h2>
            </div>
            <p className="text-[rgb(var(--muted))] text-sm sm:text-base">
              Our most-loved picks from the community
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgb(var(--border))] text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 group"
          >
            View All Products
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Scroll Controls */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[rgb(var(--card))]/80 backdrop-blur-md border border-[rgb(var(--border))] hover:scale-110 hover:shadow-lg transition-all duration-300 text-[rgb(var(--fg))]"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[rgb(var(--card))]/80 backdrop-blur-md border border-[rgb(var(--border))] hover:scale-110 hover:shadow-lg transition-all duration-300 text-[rgb(var(--fg))]"
        >
          <ChevronRight size={22} />
        </button>

        {/* Product Slider */}
        <div
          ref={scrollRef}
          className="flex  overflow-x-auto gap-6 pb-2 scroll-smooth scroller-hidden"
        >
          {products && products.length ? (
            products.slice(0, 8).map((product: any) => {
              const isInCart = cartItems.some(
                (item) => item._id === product._id
              );

              return (
                <div
                  key={product._id}
                  className="group relative min-w-[240px] sm:min-w-[280px] product-card cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {/* Image */}
                  <div className="product-card-img">
                    <img
                      src={
                        product.images[0]?.url ||
                        "https://via.placeholder.com/320x400"
                      }
                      alt={product.name}
                      className=" h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md">
                        <Star size={12} className="fill-current" />
                        Bestseller
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className="p-3 sm:p-4 flex flex-col h-fit gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-sm font-semibold line-clamp-2 text-[rgb(var(--fg))] mb-2 flex-1 min-h-[36px]">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-2">
                      <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                        ₹{product.price?.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-sm text-[rgb(var(--muted))]">
                          4.8
                        </span>
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
                        className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 text-sm font-medium rounded-lg shadow-inner cursor-default"
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
            <div className="w-full text-center py-12 text-[rgb(var(--muted))]">
              No bestsellers found
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
