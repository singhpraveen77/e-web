import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { ViewProducts } from "../api/products.api";
import { addItem } from "../redux/slices/cartSlice";
import { ShoppingCart, CheckCircle } from "lucide-react";
import type { ProductType } from "../redux/slices/productSlice";
import ProductFilters from "../compoBig/ProductFilters";

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
    <div className="app-container py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-[rgb(var(--fg))]">All Products</h1>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((item) => {
                const isInCart = cartItems.some((cart) => cart._id === item._id);

                return (
                  <div
                    key={item._id}
                    className="card p-4 flex flex-col cursor-pointer hover:shadow-md transition-base"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-[rgb(var(--card))]">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h2 className="font-semibold text-lg line-clamp-1">{item.name}</h2>
                    <p className="text-blue-600 dark:text-blue-400 text-xl font-bold mt-1">₹{item.price}</p>
                    <p className="text-[rgb(var(--muted))] text-sm line-clamp-2 mt-1">{item.description}</p>

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
                        className="mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
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
            <p className="text-center text-[rgb(var(--muted))] text-lg">No products match your filters 🚫</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
