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
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Order Summary
        </h2>

        {/* Shipping Info */}
        <div className="border-b pb-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
          {address ? (
            <div className="text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Name:</span> {address.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {address.phone}
              </p>
              <p>
                {address.address}, {address.city}, {address.state},{" "}
                {address.pincode}, {address.country}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No address found.</p>
          )}
        </div>

        {/* Cart Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Items in Cart</h3>
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between border p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Price Summary */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-2">Price Details</h3>
          <div className="space-y-2 text-gray-700">
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
            <div className="flex justify-between font-bold text-indigo-600 text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/checkout-address")}
            className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
          >
            Back to Address
          </button>
          <button
            onClick={handleProceed}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
