import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";

interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const OrderSummary: React.FC = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart.products);

  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutAddress");
    if (saved) setAddress(JSON.parse(saved));
    else navigate("/checkout/address"); // if no address, redirect back
  }, [navigate]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;

  const handleProceed = () => {
    // save summary data before going to payment
    const orderSummary = {
      subtotal,
      shipping,
      tax,
      total,
    };
    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
    navigate("/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] py-10 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl card p-8">
        <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--fg))]">Order Summary</h2>

        {/* Shipping Info */}
        <div className="border-b border-[rgb(var(--border))] pb-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
          {address ? (
            <div className="text-[rgb(var(--muted))] space-y-1">
              <p>
                <span className="font-medium text-[rgb(var(--fg))]">Name:</span> {address.name}
              </p>
              <p>
                <span className="font-medium text-[rgb(var(--fg))]">Phone:</span> {address.phone}
              </p>
              <p>
                {address.address}, {address.city}, {address.state}, {address.pincode}, {address.country}
              </p>
            </div>
          ) : (
            <p className="text-[rgb(var(--muted))]">No address found.</p>
          )}
        </div>

        {/* Cart Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Items in Cart</h3>
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between border border-[rgb(var(--border))] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-[rgb(var(--muted))]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[rgb(var(--muted))]">Your cart is empty.</p>
          )}
        </div>

        {/* Price Summary */}
        <div className="border-t border-[rgb(var(--border))] pt-4">
          <h3 className="font-semibold text-lg mb-2">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-blue-600 dark:text-blue-400 text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <button
            onClick={() => navigate("/checkout-address")}
            className="px-6 py-2 rounded-lg border border-[rgb(var(--border))] hover:bg-[rgb(var(--card))] transition-base"
          >
            Back to Address
          </button>
          <button
            onClick={handleProceed}
            className="px-6 py-2 rounded-lg transition-base bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
