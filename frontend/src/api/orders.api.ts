import type { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "../axios/axiosInstance";
import type { Order } from "../pages/MyOrders";

export const myOrders = async (): Promise<{
  success: boolean;
  data?: Order[];
  message?: string;
}> => {
  try {
    const res: AxiosResponse<{ success: boolean; data: Order[] }> =
      await axiosInstance.get("/order/myorders", { withCredentials: true });

    return {
      success: true,
      data: res.data.data,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};
