import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ShoppingBag, Home, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "../components/ui";

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

  const formatDate = (dateStr: any) =>
    dateStr ? new Date(dateStr).toLocaleString() : "N/A";

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'warning';
      case 'pending': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <Card variant="elevated" className="text-center">
          <CardContent className="py-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600 dark:text-green-400 w-12 h-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[rgb(var(--fg))] mb-3">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] mb-4">
              Thank you for shopping with us! Your order has been confirmed.
            </p>
            <Badge variant={getStatusColor(orderStatus) as any} size="lg" className="mb-4">
              Order {orderStatus || 'Confirmed'}
            </Badge>
            <p className="text-sm text-[rgb(var(--muted))]">
              Order ID: <span className="font-mono font-semibold text-[rgb(var(--fg))]">{orderId}</span>
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="text-blue-600 dark:text-blue-400" size={20} />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-[rgb(var(--muted))]">Payment Method:</span>
                      <p className="text-[rgb(var(--fg))] font-medium">{paymentInfo?.method || 'Cash on Delivery'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[rgb(var(--muted))]">Payment Status:</span>
                      <p className="text-[rgb(var(--fg))] font-medium">{paymentInfo?.status || 'Pending'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-[rgb(var(--muted))]">Transaction ID:</span>
                      <p className="text-[rgb(var(--fg))] font-mono text-xs">{paymentInfo?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[rgb(var(--muted))]">Order Date:</span>
                      <p className="text-[rgb(var(--fg))] font-medium flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(paidAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-green-600 dark:text-green-400" size={20} />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-[rgb(var(--fg))]">{shippingInfo?.address}</p>
                  <p className="text-[rgb(var(--muted))]">
                    {shippingInfo?.city}, {shippingInfo?.state} {shippingInfo?.pinCode}
                  </p>
                  <p className="text-[rgb(var(--muted))]">{shippingInfo?.country}</p>
                  <p className="text-[rgb(var(--fg))] font-medium">Phone: {shippingInfo?.phoneNo}</p>
                </div>
              </CardContent>
            </Card>

            {/* Items Ordered */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="text-purple-600 dark:text-purple-400" size={20} />
                  Items Ordered ({orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item: any, index: number) => (
                    <div key={item._id || index} className="flex items-center gap-4 p-3 border border-[rgb(var(--border))] rounded-lg">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <Badge variant="secondary" size="sm" className="absolute -top-2 -right-2">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[rgb(var(--fg))] line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-[rgb(var(--muted))] mt-1">
                          ₹{item.price?.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[rgb(var(--fg))]">
                          ₹{(item.quantity * item.price)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="text-orange-600 dark:text-orange-400" size={20} />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--muted))]">Subtotal:</span>
                    <span className="font-medium">₹{itemPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--muted))]">Tax:</span>
                    <span className="font-medium">₹{taxPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--muted))]">Shipping:</span>
                    <span className="font-medium">
                      {shippingPrice === 0 ? 'Free' : `₹${shippingPrice?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="border-t border-[rgb(var(--border))] pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[rgb(var(--fg))]">Total:</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/my-orders")}
                variant="primary"
                className="w-full"
                leftIcon={<Eye size={16} />}
              >
                View My Orders
              </Button>
              
              <Button 
                onClick={() => navigate("/")}
                variant="secondary"
                className="w-full"
                leftIcon={<Home size={16} />}
              >
                Continue Shopping
              </Button>
            </div>

            {/* Estimated Delivery */}
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm">
                  <p className="font-medium text-[rgb(var(--fg))] mb-1">Estimated Delivery</p>
                  <p className="text-[rgb(var(--muted))]">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
