import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { ViewProducts } from "../api/products.api";
import { addItem } from "../redux/slices/cartSlice";
import { ShoppingCart, CheckCircle, Menu, Filter as FilterIcon } from "lucide-react";
import type { ProductType } from "../redux/slices/productSlice";
import ProductFilters, { categories, type Category } from "../compoBig/ProductFilters";

const AllProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [price, setPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [localSearch, setLocalSearch] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.products);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
        setProducts(Array.isArray(res) ? res : []);        
        const max = Math.max(...res.map((p: ProductType) => p.price || 0));
        setMaxPrice(max);
        setPrice(max);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // *** MEMOIZED Helper function with proper typing ***
  const matchesCategoryFilter = useCallback((productCategory: string, selectedCategory: string): boolean => {
    if (selectedCategory === "All") return true;
    
    const normalizedProductCat = productCategory?.toLowerCase() ?? "";
    const normalizedSelectedCat = selectedCategory?.toLowerCase() ?? "";
    
    if (normalizedProductCat === normalizedSelectedCat) return true;
    
    const parentCat: Category | undefined = categories.find(
      (cat) => cat.value.toLowerCase() === normalizedSelectedCat
    );
    
    if (parentCat && parentCat.subcategories.length > 0) {
      return parentCat.subcategories.some(
        (sub) => sub.value.toLowerCase() === normalizedProductCat
      );
    }
    
    return false;
  }, []);

  // Filter + Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = matchesCategoryFilter(item.category || "", category);
      const matchesPrice = item.price <= price;
      const matchesRating = rating === 0 || item.rating >= rating;
      const matchesSearch =
        !localSearch ||
        (item.name && item.name.toLowerCase().includes(localSearch)) ||
        (item.category && item.category.toLowerCase().includes(localSearch));

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });
  }, [products, category, price, rating, localSearch, matchesCategoryFilter]);

  // Reset Filters
  const resetFilters = (): void => {
    setCategory("All");
    setRating(0);
    setPrice(maxPrice);
    setLocalSearch("");
    setSearchParams({});
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="app-container w-full relative py-10">
      {/* Header + Mobile filter toggle */}
      <div className="flex  items-center justify-between mb-6 ">
        <div className=" lg:ml-80">
            <h1 className="text-2xl  sm:text-3xl font-bold text-[rgb(var(--fg))]">All Products</h1>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="md:hidden inline-flex items-center gap-2 rounded-full px-3 py-2 border border-[rgb(var(--border))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))] transition-base"
          aria-label="Open filters"
        >
          <Menu size={18} />
          <span className="hidden xs:inline">Filters</span>
        </button>
      </div>

      <div className="flex flex-col w-full md:flex-row gap-8">
        {/* Sidebar Filters (desktop/tablet) */}
        <div className="hidden md:block relative md:w-72 md:sticky md:top-20 self-start sticky-filter">
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
        </div>

        {/* Product List */}
        <div className="flex-1 w-full">
          <div className="mb-6">
            <p className="text-[rgb(var(--muted))]">
              Showing <span className="font-semibold text-[rgb(var(--fg))]">{filteredProducts.length}</span> products
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map((item) => {
                const isInCart = cartItems.some((cart) => cart._id === item._id);

                return (
                  <div
                    key={item._id}
                    className="card p-2 sm:p-3 lg:p-4 flex flex-col cursor-pointer hover:shadow-md transition-base"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div className="relative aspect-square sm:aspect-[4/3] rounded-md overflow-hidden mb-2 sm:mb-3 bg-[rgb(var(--card))]">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h2 className="font-semibold text-[10px] sm:text-sm line-clamp-1">{item.name}</h2>
                    <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-base font-bold mt-0.5 sm:mt-1">₹{item.price}</p>
                    <p className="hidden sm:block text-[rgb(var(--muted))] text-sm line-clamp-2 mt-1">{item.description}</p>

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
                        className="mt-auto flex items-center justify-center gap-1 sm:gap-2 rounded-md px-2 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        onClick={(e) => e.stopPropagation()}
                        className="mt-auto flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white py-1.5 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-sm rounded-md cursor-default"
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
            <div className="w-full">
              <p className="text-center text-[rgb(var(--muted))] text-lg">No products match your filters 🚫</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-[rgb(var(--bg))] border-l border-[rgb(var(--border))] shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--border))]">
              <div className="flex items-center gap-2 text-[rgb(var(--fg))]">
                <FilterIcon size={18} />
                <span className="font-semibold">Filters</span>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex items-center rounded-full p-1 hover:bg-[rgb(var(--card))] transition-base"
                aria-label="Close filters"
                title="Close"
              >
                {/* Arrow icon instead of text */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-52px)]">
              <ProductFilters
                maxPrice={maxPrice}
                price={price}
                setPrice={setPrice}
                category={category}
                setCategory={(val) => setCategory(val)}
                rating={rating}
                setRating={setRating}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
