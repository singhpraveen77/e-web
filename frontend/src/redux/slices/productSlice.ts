import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios/axiosInstance";

interface Review {
  userId: string;
  name: string;
  avatar: {
    public_id?: string;
    url?: string;
  };
  rating: number;
  comment: string;
}

export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  images: {
    public_id?: string;
    url?: string;
  }[];
  category: string;
  stock: number;
  numOfReviews: number;
  reviews: Review[];
  user: string; // userId reference
  createdAt: string;
  updatedAt: string;
}

// interface ProductsResponse {
//   products: ProductType[];
//   productCount: number;
//   filteredProductsCount: number;
//   resultPerPage: number;
// }

// interface ProductsResponse {
//   products: ProductType[];
//   productCount: number;
//   filteredProductsCount: number;
//   resultPerPage: number;
// }

interface ProductsState {
  products: ProductType[] | null;
  loading: boolean;
  error: string | null;
}

export const AllProducts = createAsyncThunk<ProductType[]>(
  "products/getall",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/product/all");
      const products: ProductType[] = res?.data?.data?.products;
      localStorage.setItem("products", JSON.stringify(products));
      console.log("products ",products);

       return products; // ✅ return array
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

const initialState: ProductsState = {
  products: localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products") as string)
    : null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productsRefresh: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(AllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Unknown error";
      })
      .addCase(AllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload;
      });
  },
});

export const { productsRefresh } = productSlice.actions;
export default productSlice.reducer;
