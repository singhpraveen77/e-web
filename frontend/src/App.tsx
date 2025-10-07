import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { me } from "./redux/slices/authSlice";
import type { AppDispatch, RootState } from "./redux/store";
import router from "./component/Router"; // router is defined separately

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}
