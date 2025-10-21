import React from "react";

export interface ProductCardSkeletonProps {
  variant?: "grid" | "slider";
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ variant = "grid" }) => {
  const base = variant === "slider" ? "min-w-[240px] sm:min-w-[280px]" : "";
  return (
    <div className={`product-card ${base}`}>
      <div className="product-card-img">
        <div className="skeleton skeleton--rect w-100 h-full" />
      </div>
      <div className="p-3 sm:p-4">
        <div className="skeleton skeleton--text w-75" />
        <div className="skeleton skeleton--text w-50" />
        <div className="skeleton skeleton--button w-100 mt-3" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;