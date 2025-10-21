// ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading)
    return (
      <div className="app-container py-10">
        <div className="skeleton skeleton--text w-33 mb-4" />
        <div className="skeleton skeleton--rect w-100" style={{ height: 200, borderRadius: 16 }} />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;


