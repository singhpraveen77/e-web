import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { ViewProducts } from "../api/products.api";
import { addItem } from "../redux/slices/cartSlice";
import { ShoppingCart, CheckCircle } from "lucide-react";
import type { ProductType } from "../redux/slices/productSlice";
import ProductFilters from "../component/ProductFilters";

const AllProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [price, setPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [localSearch, setLocalSearch] = useState(""); // local search state

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.products);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Sync searchQuery from URL into localSearch state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await ViewProducts();
        setProducts(res);
        const max = Math.max(...res.map((p: ProductType) => p.price || 0));
        setMaxPrice(max);
        setPrice(max);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter + Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        category === "All" ||
        (item.category && item.category.toLowerCase() === category.toLowerCase());

      const matchesPrice = item.price <= price;

      const matchesRating = rating === 0 || item.rating >= rating;

      const matchesSearch =
        !localSearch ||
        (item.name && item.name.toLowerCase().includes(localSearch)) ||
        (item.category && item.category.toLowerCase().includes(localSearch));

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });
  }, [products, category, price, rating, localSearch]);

  // Reset Filters
  const resetFilters = () => {
    setCategory("All");
    setRating(0);
    setPrice(maxPrice);
    setLocalSearch(""); // reset search
    setSearchParams({}); // clear search from URL
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <ProductFilters
          maxPrice={maxPrice}
          price={price}
          setPrice={setPrice}
          category={category}
          setCategory={setCategory}
          rating={rating}
          setRating={setRating}
          resetFilters={resetFilters}
        />

        {/* Product List */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((item) => {
                const isInCart = cartItems.some((cart) => cart._id === item._id);

                return (
                  <div
                    key={item._id}
                    className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={item.images[0]?.url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h2 className="font-semibold text-lg truncate">{item.name}</h2>
                    <p className="text-indigo-600 text-xl font-bold mt-2">
                      ₹{item.price}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    {!isInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            addItem({
                              _id: item._id,
                              name: item.name,
                              price: item.price,
                              image: item.images[0]?.url,
                              quantity: 1,
                            })
                          );
                        }}
                        className="mt-auto flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        onClick={(e) => e.stopPropagation()}
                        className="mt-auto flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg cursor-default"
                      >
                        <CheckCircle size={18} />
                        Added
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No products match your filters 🚫
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
