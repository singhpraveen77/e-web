// router.tsx
import {
  createBrowserRouter,
  
} from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import HomePage from "../pages/HomePage";
import Login from "../pages/LoginPage";
import Signup from "../pages/SignupPage";
import Profile from "../pages/ProfilePage";
import AddProduct from "./AddProducts";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersPage from "../pages/admin/UserPageAdmin";
import ProductsPage from "../pages/admin/ProductsPageAdmin";
import ProductDetails from "../pages/ProductDetails";
import CartPage from "../pages/Cartpage";
import AllProducts from "../pages/AllProducts";
import CheckoutAddress from "../pages/CheckoutAddress";
import OrderSummary from "../pages/OrderSummary";
import PaymentPage from "../pages/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";

import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Public routes
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/products", element: <AllProducts /> },
      { path: "/product/:id", element: <ProductDetails /> },

      // Protected routes (must be logged in)
      {
        element: <ProtectedRoute />, // ⬅️ protect everything below
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout-address", element: <CheckoutAddress /> },
          { path: "/checkout/summary", element: <OrderSummary /> },
          { path: "/checkout/payment", element: <PaymentPage /> },
          { path: "/order-success", element: <OrderSuccess /> },
          { path: "/my-orders", element: <MyOrders /> },

          // admin routes
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/users", element: <UsersPage /> },
          { path: "/admin/products", element: <ProductsPage /> },
          { path: "/admin/products/addProducts", element: <AddProduct /> },
        ],
      },
    ],
  },
]);
export default router;


