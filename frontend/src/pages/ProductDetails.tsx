import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";
import type { ProductType } from "../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { ShoppingCart, CheckCircle } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductType | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.products);

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/product/${id}`);
        setProduct(res?.data?.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Product not found ❌
      </div>
    );
  }

  const isInCart = cartItems.some((item) => item._id === product._id);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-xl rounded-2xl p-6">
        {/* Product Image */}
        <div className="group relative">
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-105"
          />
          {product.category && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`text-lg ${
                    idx < (product.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-gray-500 text-sm">
                ({product.numOfReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-blue-600 mb-6">
              ₹{product.price}
            </p>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock info */}
            <p
              className={`mb-6 font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </p>
          </div>

          {/* Add to Cart Button */}
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
              disabled={product.stock <= 0}
              className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold shadow-lg transform transition duration-300 flex items-center justify-center gap-2 ${
                product.stock > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold shadow-lg bg-green-600 text-white flex items-center justify-center gap-2 cursor-default"
            >
              <CheckCircle size={20} />
              Added
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
