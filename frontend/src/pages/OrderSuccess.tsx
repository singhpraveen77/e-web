import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Order data from Payment Page
  const order = location.state?.order || {};
  const orderId = order?._id || "N/A";

  const {
    orderStatus,
    paidAt,
    paymentInfo,
    shippingInfo,
    orderItems = [],
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = order;

  const formatDate = (dateStr:any) =>
    dateStr ? new Date(dateStr).toLocaleString() : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Success Message */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Order Placed Successfully 🎉
          </h1>
          <p className="text-gray-500 mt-1">
            Thank you for shopping with us! Your order has been confirmed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            🧾 Order Summary
          </h2>
          <div className="grid grid-cols-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Order ID:</span> {orderId}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="uppercase text-blue-600">{orderStatus}</span>
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              {paymentInfo?.status || "N/A"}
            </p>
            <p>
              <span className="font-medium">Transaction ID:</span>{" "}
              {paymentInfo?.id || "N/A"}
            </p>
            <p>
              <span className="font-medium">Placed On:</span> {formatDate(paidAt)}
            </p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📦 Shipping Information
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p>{shippingInfo?.address}</p>
            <p>
              {shippingInfo?.city}, {shippingInfo?.state}
            </p>
            <p>
              {shippingInfo?.country} - {shippingInfo?.pinCode}
            </p>
            <p>Phone: {shippingInfo?.phoneNo}</p>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            🛍️ Items Ordered
          </h2>
          <div className="divide-y divide-gray-200">
            {orderItems.map((item:any) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-700">
                  ₹{item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            💰 Payment Details
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span> <span>₹{itemPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span> <span>₹{taxPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span> <span>₹{shippingPrice}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
              <span>Total:</span> <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
