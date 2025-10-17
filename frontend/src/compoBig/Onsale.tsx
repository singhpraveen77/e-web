// import React from "react";
import { ShoppingCart } from "lucide-react";

const saleProducts = [
  {
    id: 1,
    name: "Gaming Laptop",
    oldPrice: "$1299",
    newPrice: "$999",
    image: "https://source.unsplash.com/400x400/?gaming,laptop",
  },
  {
    id: 2,
    name: "Smartphone Pro",
    oldPrice: "$899",
    newPrice: "$699",
    image: "https://source.unsplash.com/400x400/?smartphone",
  },
  {
    id: 3,
    name: "DSLR Camera",
    oldPrice: "$1099",
    newPrice: "$849",
    image: "https://source.unsplash.com/400x400/?camera",
  },
  {
    id: 4,
    name: "Noise Cancelling Headphones",
    oldPrice: "$299",
    newPrice: "$199",
    image: "https://source.unsplash.com/400x400/?headphones",
  },
];

export default function OnSale() {
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-red-600">
          🔥 On Sale
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {saleProducts.map((product) => (
            <div
              key={product.id}
              className="relative w-full sm:w-[45%] md:w-[30%] lg:w-[22%] bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              {/* Sale Badge */}
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                Sale
              </span>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 line-through">
                    {product.oldPrice}
                  </span>
                  <span className="text-red-600 text-xl font-bold">
                    {product.newPrice}
                  </span>
                </div>
                <button className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
