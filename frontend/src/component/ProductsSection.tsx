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
    <section className="py-12 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header + View More */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Products</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-indigo-600 hover:underline font-medium"
          >
            View More →
          </button>
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* Horizontal Scroll Section */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll space-x-6 scroller-hidden scroll-smooth"        >
          {products && products.length !== 0 ? (
            products.map((product: any) => {
              const isInCart = cartItems.some(
                (item) => item._id === product._id
              );

              return (
                <div
                  key={product._id}
                  className="min-w-[220px] sm:min-w-[250px] md:min-w-[280px] bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div
                    className="p-4 flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-indigo-600 text-xl font-bold mt-2">
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
                        className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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
            <div>No products found !!</div>
          )}
        </div>
      </div>
    </section>
  );
}
