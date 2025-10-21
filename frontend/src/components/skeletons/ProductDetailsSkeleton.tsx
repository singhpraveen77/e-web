import React from "react";

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="app-container py-6 mt-6 sm:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 card p-6">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <div className="skeleton w-100 h-full" />
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="skeleton skeleton--text w-75 mb-2" />
            <div className="skeleton skeleton--text w-50 mb-4" />
            <div className="skeleton skeleton--text w-100 mb-2" />
            <div className="skeleton skeleton--text w-90 mb-2" />
            <div className="skeleton skeleton--text w-80 mb-6" />
            <div className="skeleton skeleton--text w-40 mb-6" />
          </div>
          <div className="skeleton skeleton--button w-50" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;