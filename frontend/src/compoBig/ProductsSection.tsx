import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../redux/slices/productSlice";
import { addItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function ProductsSection() {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--bg))] relative">
      <div className="app-container">
        {/* Header + View More */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--fg))]">Products</h2>
          <button
            onClick={() => navigate("/products")}
            className="transition-base text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View More →
          </button>
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full p-2 hover:shadow-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full p-2 hover:shadow-sm"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Horizontal Scroll Section */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 sm:space-x-6 scroller-hidden scroll-smooth pb-1"
        >
          {products && products.length !== 0 ? (
            products.map((product: any) => {
              const isInCart = cartItems.some((item) => item._id === product._id);

              return (
                <div
                  key={product._id}
                  className="min-w-[220px] sm:min-w-[250px] md:min-w-[280px] card overflow-hidden hover:shadow-md transition-base cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="relative aspect-[4/5] bg-[rgb(var(--card))]">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className="p-4 flex flex-col items-center text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{product.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 text-lg font-bold mt-1">
                      ₹{product.price}
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
                        className="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg cursor-default"
                      >
                        <CheckCircle size={18} />
                        Added
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-[rgb(var(--muted))]">No products found !!</div>
          )}
        </div>
      </div>
    </section>
  );
}
