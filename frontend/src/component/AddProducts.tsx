import React, { useState } from "react";
import axios from "axios";

import { getNextProduct } from "../dataSet/RandomData";
import { AllProducts } from "../redux/slices/productSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";


interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[]; // store files instead of URL
}

const categories = [
  "laptop",
  "mobile",
  "watch",
  "camera",
  "headphone",
  "tablet",
  "accessories",
  "other",
];

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 1,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch=useDispatch<AppDispatch>()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "stock") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const RandomFill=()=>{
    const rd_product=getNextProduct();
    setFormData({...rd_product,images:[]}) 
    setMessage("");
  }

  // handle multiple file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("category", formData.category);
      data.append("stock", String(formData.stock));

      // append files
      formData.images.forEach((file) => {
        data.append("images", file);
      });

      const res = await axios.post("http://localhost:5000/app/v1/admin/product/new", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // if backend requires cookies/auth
      });

      setMessage("✅ Product added successfully!");
      console.log("Product Created:", res.data);
      dispatch(AllProducts());

      // reset
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 1,
        images: [],
      });
    } 
    catch (error: any) {
      console.error("❌ Error adding product:", error);
      setMessage("❌ Failed to add product");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {message && <p className="mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter product price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

       

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock (Quantity)
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            placeholder="Enter stock quantity"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>


        {/* File upload input */}
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
        <button
        type="button"
        onClick={RandomFill}
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          fill data          
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
