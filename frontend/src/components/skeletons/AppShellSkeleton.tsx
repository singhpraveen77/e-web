import React from "react";

const AppShellSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Top nav placeholder */}
      <div className="sticky top-0 z-40 bg-[rgb(var(--card))]/70 backdrop-blur-xl border-b border-[rgb(var(--border))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="skeleton skeleton--text w-25" />
            <div className="hidden md:flex items-center gap-4">
              <div className="skeleton skeleton--pill w-25" />
              <div className="skeleton skeleton--circle" />
              <div className="skeleton skeleton--circle" />
            </div>
            <div className="md:hidden skeleton skeleton--circle" />
          </div>
        </div>
      </div>

      {/* Hero and grid placeholders */}
      <div className="app-container section-y">
        <div className="skeleton skeleton--rect w-100" style={{ height: 240, borderRadius: 16 }} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="product-card">
                <div className="product-card-img">
                  <div className="skeleton skeleton--rect w-100 h-full" />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="skeleton skeleton--text w-75" />
                  <div className="skeleton skeleton--text w-50" />
                  <div className="skeleton skeleton--button w-100 mt-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppShellSkeleton;