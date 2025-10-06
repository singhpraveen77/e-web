import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage';
import Login from "./pages/LoginPage";
import Profile from "./pages/ProfilePage";
import Signup from "./pages/SignupPage";
import AddProduct from "./component/AddProducts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UserPageAdmin";
import ProductsPage from "./pages/admin/ProductsPageAdmin";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/Cartpage";
import AllProducts from "./pages/AllProducts";
import CheckoutAddress from "./pages/CheckoutAddress";
import OrderSummary from "./pages/OrderSummary";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";


function App() {
  const router=createBrowserRouter([
    {
      path:"/",
      element:<AppLayout/>,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/signup",
          element:<Signup/>
        },
        {
          path:"/cart",
          element:<CartPage/>
        },
        {
          path:"/products",
          element:<AllProducts/>
        },
        {
          path:"/profile",
          element:<Profile/>
        },
        
        {
          path:"/admin",
          element:<AdminDashboard/>,
          
        },
        { 
          path: "/admin/users",
          element: <UsersPage />
        },
        // separate page
        { 
          path: "/admin/products",
          element: <ProductsPage />
        },
        {
          path:"/admin/products/addProducts",
          element:<AddProduct/>
        },
        {
          path:"/product/:id",
          element:<ProductDetails />
        },
        {
          path:"/checkout-address",
          element:<CheckoutAddress/>
        },
        {
          path:"/checkout/summary",
          element:<OrderSummary/>
        },
        {
          path:"/checkout/payment",
          element:<PaymentPage/>
        },
        {
          path:"/order-success",
          element:<OrderSuccess/>
        },
        {
          path:"/my-orders",
          element:<MyOrders/>
        },
      ]
    }
  ])

  
  return <RouterProvider router={router} />
  
}

export default App
