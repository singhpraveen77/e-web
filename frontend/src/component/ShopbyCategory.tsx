import { ShoppingCart, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../redux/slices/productSlice";
import { addItem } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Trending Products</h2>

        <div className="flex flex-wrap justify-center gap-8">
          {products && products.length !== 0 ? (
            products.map((product: any) => {
              const isInCart = cartItems.some((item) => item._id === product._id);

              return (
                <div
                  key={product._id}
                  className="w-full sm:w-[45%] md:w-[30%] lg:w-[22%] bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div
                    className="p-4 flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()} // stop card navigation when clicking button
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
