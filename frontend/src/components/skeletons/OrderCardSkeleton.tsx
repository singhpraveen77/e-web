import React from "react";

const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="border border-[rgb(var(--border))] rounded-2xl p-5 shadow-sm bg-[rgb(var(--card))]">
      <div className="flex justify-between items-center mb-3">
        <div className="skeleton skeleton--text w-50" />
        <div className="skeleton skeleton--pill w-25" />
      </div>
      <div className="skeleton skeleton--text w-33 mb-3" />
      <div className="border-t border-[rgb(var(--border))] pt-3 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="skeleton skeleton--rect" style={{ width: 64, height: 64, borderRadius: 12 }} />
              <div>
                <div className="skeleton skeleton--text w-75 mb-1" />
                <div className="skeleton skeleton--text w-50" />
              </div>
            </div>
            <div className="skeleton skeleton--text w-25" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCardSkeleton;