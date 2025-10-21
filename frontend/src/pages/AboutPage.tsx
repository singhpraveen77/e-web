import React from "react";

export default function AboutPage(): React.ReactElement {
  return (
    <main className="min-h-screen w-full section-y px-6 lg:px-16">
      <div className="app-container">
        {/* Hero */}
        <section className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[rgb(var(--fg))]">About Us</h1>
          <p className="mt-3 text-[rgb(var(--muted))] max-w-2xl mx-auto text-base sm:text-lg">
            We’re building a fast, modern shopping experience with great products and great service.
          </p>
        </section>

        {/* Content grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-2 text-[rgb(var(--fg))]">Our Mission</h2>
            <p className="text-[rgb(var(--muted))]">
              To deliver quality products at fair prices with a delightful, responsive UI that works on every device.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-2 text-[rgb(var(--fg))]">What We Do</h2>
            <p className="text-[rgb(var(--muted))]">
              From electronics to apparel, we curate and ship products quickly, backed by helpful support.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
