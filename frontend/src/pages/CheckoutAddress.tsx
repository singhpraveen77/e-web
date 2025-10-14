import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutAddress: React.FC = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simple validation
    if (!address.name || !address.phone || !address.address) {
      alert("Please fill in all required fields!");
      return;
    }

    // store in localStorage
    localStorage.setItem("checkoutAddress", JSON.stringify(address));
    navigate("/checkout/summary");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[rgb(var(--bg))] py-10">
      <div className="card p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--fg))]">Shipping Address</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[rgb(var(--fg))] font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={address.name}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              required
            />
          </div>

          <div>
            <label className="block text-[rgb(var(--fg))] font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              required
            />
          </div>

          <div>
            <label className="block text-[rgb(var(--fg))] font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={address.address}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[rgb(var(--fg))] font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              />
            </div>

            <div>
              <label className="block text-[rgb(var(--fg))] font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[rgb(var(--fg))] font-medium mb-1">Pincode</label>
              <input
                type="number"
                name="pinCode"
                value={address.pinCode}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              />
            </div>

            <div>
              <label className="block text-[rgb(var(--fg))] font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus-visible:ring-[rgb(var(--ring))]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg font-semibold transition-base bg-blue-600 text-white py-2 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Continue to Summary
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutAddress;
