import React, { useEffect, useState } from "react";
import { myOrders } from "../api/orders.api";
import { useTheme } from "../context/ThemeContext"; // ✅ import theme context

// 🧩 Types
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNo: number;
}

interface PaymentInfo {
  id: string;
  status: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  _id: string;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  user: string;
  paymentInfo: PaymentInfo;
  paidAt: string;
  itemPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  shippingInfo: ShippingInfo;
}

// 🌙 Component
const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { resolvedTheme } = useTheme(); // ✅ get current theme

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await myOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        setError(res.message || "Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Frontend pagination (declare hooks before any returns)
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(orders.length / perPage));
  const paginated = orders.slice((page - 1) * perPage, page * perPage);
  const goTo = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));

  // 🌀 Loading / Error States
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-600 dark:text-red-400 text-lg font-semibold transition-colors duration-300">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">
        You haven’t placed any orders yet.
      </div>
    );
  }

  // 🧾 Orders list
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        My Orders
      </h1>

      <div className="space-y-6">
        {paginated.map((order) => (
          <div
            key={order._id}
            className="
              border border-gray-200 dark:border-gray-700
              rounded-2xl p-5 
              shadow-sm hover:shadow-lg
              transition-all duration-300
              bg-white dark:bg-gray-900/80
              backdrop-blur-sm
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200">
                Order ID:{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {order._id}
                </span>
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.orderStatus === "DELIVERED"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : order.orderStatus === "CANCELLED"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* Order Items */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-none"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-100 dark:border-gray-700"
                    />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex justify-between mt-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Total Price:</strong> ₹{order.totalPrice}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentInfo?.status}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Address:</strong>{" "}
                {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pinCode}`}
              </p>
              <p>
                <strong>Phone:</strong> {order.shippingInfo.phoneNo}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={`px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 ${
              page === i + 1 ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
