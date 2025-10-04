import products from "./mock_products.json";

// circular index tracker
let currentIndex = 0;

export function getNextProduct() {
  const product = products[currentIndex];
  currentIndex = (currentIndex + 1) % products.length; // move to next, wrap around
  return product;
}

