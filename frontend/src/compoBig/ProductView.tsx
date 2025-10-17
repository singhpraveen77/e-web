"use client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { AllProducts} from "../api/products.api";

// Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  desc: string;
  img: string;
}

// Dummy products
const dummyProducts: Product[] = [
  { id: 1, name: "Fresh Apples", price: 120, desc: "Crisp and sweet apples.", img: "https://via.placeholder.com/200" },
  { id: 2, name: "Organic Wheat", price: 55, desc: "High quality organic wheat.", img: "https://via.placeholder.com/200" },
];

// Props for ProductView
interface ProductViewProps {
  addToCart: (product: Product) => void;
}


const ProductView: React.FC<ProductViewProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = dummyProducts.find((p) => p.id === Number(id));

  if (!product) {
    return <div className="p-6 text-center text-red-500">Product not found!</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Product Image */}
      <div className="flex-1">
        <img src={product.img} alt={product.name} className="rounded-2xl shadow-lg w-full" />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.desc}</p>
          <p className="text-xl font-semibold text-green-600">₹{product.price}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => addToCart(product)}
            className="px-5 py-2 rounded-2xl bg-yellow-500 text-white hover:bg-yellow-600 shadow"
          >
            Add to Cart
          </button>
          <button
            onClick={() => {
              addToCart(product);
              navigate("/checkout");
            }}
            className="px-5 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 shadow"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
