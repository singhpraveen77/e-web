import { useDispatch, useSelector } from "react-redux";
import type{ RootState,AppDispatch} from "../redux/store";
import { removeItem, updateQuantity } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.products);

  const grossTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmit=(e:any)=>{
    e.preventDefault();
    navigate("/checkout-address");

  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      {/* Cart Items */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 md:grid-cols-5 p-4 bg-gray-100 font-semibold">
          <span className="col-span-2">Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-center hidden md:block">Price</span>
          <span className="text-right">Subtotal</span>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((item:any) => (
            <div
              key={item._id}
              className="grid grid-cols-3 md:grid-cols-5 items-center gap-4 p-4 border-b"
            >
              {/* Product */}
              <div className="flex items-center gap-4 col-span-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shadow"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => dispatch(removeItem(item._id))}
                    className="text-red-500 text-sm mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({ id: item._id, quantity: item.quantity - 1 })
                    )
                  }
                  className="px-2 py-1 border rounded-l hover:bg-gray-200"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 border-t border-b">{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({ id: item._id, quantity: item.quantity + 1 })
                    )
                  }
                  className="px-2 py-1 border rounded-r hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Price (hidden on mobile) */}
              <div className="hidden md:block text-center">
                ₹{item.price.toLocaleString()}
              </div>

              {/* Subtotal */}
              <div className="text-right font-semibold">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-500">Your cart is empty</p>
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg max-w-md ml-auto">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Gross Total:</span>
            <span>₹{grossTotal.toLocaleString()}</span>
          </div>
          <button
          onClick={handleSubmit}
           className="w-full bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 transition">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
