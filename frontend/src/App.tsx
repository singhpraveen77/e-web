import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { me } from "./redux/slices/authSlice";
import type { AppDispatch, RootState } from "./redux/store";
import router from "./compoBig/Router"; // router is defined separately
import AppShellSkeleton from "./components/skeletons/AppShellSkeleton";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  if (loading) return <AppShellSkeleton />;

  return <RouterProvider router={router} />;
}
