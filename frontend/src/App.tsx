import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { me } from "./redux/slices/authSlice";
import type { AppDispatch, RootState } from "./redux/store";
import router from "./compoBig/Router"; // router is defined separately
import AppShellSkeleton from "./components/skeletons/AppShellSkeleton";

export default function App() {
  
  return <RouterProvider router={router} />;
}
