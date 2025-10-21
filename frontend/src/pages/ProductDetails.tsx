import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";
import type { ProductType } from "../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { ShoppingCart, CheckCircle } from "lucide-react";
import ProductDetailsSkeleton from "../components/skeletons/ProductDetailsSkeleton";

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
    return <ProductDetailsSkeleton />;
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
    <div className="app-container py-6 mt-6 sm:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 card p-6">
        {/* Product Image */}
        <div className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <img
              src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
              alt={product.name}
              className="h-full w-full object-cover transition-base group-hover:scale-[1.02]"
            />
          </div>
          {product.category && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`text-lg ${idx < (product.rating || 0) ? "text-yellow-400" : "text-[rgb(var(--border))]"}`}
                >
                  ★
                </span>
              ))}
              <span className="text-[rgb(var(--muted))] text-sm">
                ({product.numOfReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ₹{product.price}
            </p>

            {/* Description */}
            <p className="text-[rgb(var(--muted))] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock info */}
            <p
              className={`mb-6 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
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
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold shadow-sm transition-base flex items-center justify-center gap-2 ${
                product.stock > 0
                  ? "bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                  : "bg-[rgb(var(--border))] text-[rgb(var(--muted))] cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold shadow-sm bg-green-600 text-white flex items-center justify-center gap-2 cursor-default"
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
