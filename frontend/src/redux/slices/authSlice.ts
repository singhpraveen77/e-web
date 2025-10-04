// src/redux/slices/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit'
import { axiosInstance } from '../../axios/axiosInstance';

// --- Types ---
// --- Types ---
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";  // 👈 added role
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface LogoutResponse {
  message: string;
}

// --- Async Thunks ---
// Login thunk
export const Login = createAsyncThunk<
  LoginResponse,
  LoginForm,
  { rejectValue: string }
>('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post<LoginResponse>('/user/login', formData);

    // Save user in localStorage
    localStorage.setItem('user', JSON.stringify(res.data.user));

    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Logout thunk
export const Logout = createAsyncThunk<LogoutResponse, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<LogoutResponse>('/user/logout');

      // Clear localStorage
      localStorage.removeItem('user');

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// --- Initial State ---
const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  loading: false,
  error: null,
};

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous reset
    authRefresh: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      })

      // Logout cases
      .addCase(Logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(Logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      });
  },
});

// --- Exports ---
export const { authRefresh } = authSlice.actions; // synchronous reset
export default authSlice.reducer;
