import React, { useEffect, useState } from "react";
import { myOrders } from "../api/orders.api";

// 🧩 1. Define types that match your backend Mongoose schema
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

// 🧠 2. Component definition
const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  // 🌀 3. Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg font-medium text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600 text-lg">
        You haven’t placed any orders yet.
      </div>
    );
  }

  // 📦 4. Render order list
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">
                Order ID: <span className="text-indigo-600">{order._id}</span>
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.orderStatus === "DELIVERED"
                    ? "bg-green-100 text-green-600"
                    : order.orderStatus === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div className="border-t pt-3">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-none"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-sm text-gray-700">
              <p>
                <strong>Total Price:</strong> ₹{order.totalPrice}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentInfo?.status}
              </p>
            </div>

            <div className="mt-3 text-sm text-gray-500">
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
    </div>
  );
};

export default MyOrders;


