import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import {axiosInstance} from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { useState } from "react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart.products);
  const address = JSON.parse(localStorage.getItem("checkoutAddress") as string ) || null;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handleCOD = async () => {
    setLoading(true);
    setMessage("");

    try {
      const orderData = {
        shippingInfo: {
          address: address.address,
          city: address.city,
          state: address.state,
          country: address.country || "India",
          pinCode: address.pinCode,
          phoneNo: address.phone, // ✅ correct field name
        },
        orderItems: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          productId: item._id,
        })),
        paymentInfo: {
          id: "COD_" + Date.now(),
          status: "Pending",
          method: "Cash on Delivery",
        },
        itemPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

    const res = await axiosInstance.post("/order/new", orderData);
    console.log("res data in the order success:",res.data.data);
    
      if (res.data.success) {
        dispatch(clearCart());
        navigate("/order-success", { state: { order: res.data.data } });
      } else {
        setMessage("Failed to place order. Please try again.");
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-[rgb(var(--fg))]">Confirm Your Order</h2>

      {/* Address Summary */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <p className="text-[rgb(var(--fg))]">{address.name}</p>
        <p className="text-[rgb(var(--fg))]">{address.address}</p>
        <p className="text-[rgb(var(--fg))]">
          {address.city}, {address.state}, {address.pinCode}
        </p>
        <p className="text-[rgb(var(--fg))]">Phone: {address.phone}</p>
      </div>

      {/* Order Summary */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax (18%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>
        <hr className="my-3 border-[rgb(var(--border))]" />
        <div className="flex justify-between font-bold text-lg text-blue-600 dark:text-blue-400">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* COD Button */}
      <button
        onClick={handleCOD}
        disabled={loading}
        className="w-full rounded-lg text-lg font-medium py-3 transition-base bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
      </button>

      {message && <p className="text-center text-red-600 mt-4">{message}</p>}
    </div>
  );
};

export default PaymentPage;
