// src/redux/slices/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios/axiosInstance';

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: Avatar | null;
}

export interface Avatar {
  url:string ;
  public_id: string ;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
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

// Login
export const Login = createAsyncThunk<
  LoginResponse,
  LoginForm,
  { rejectValue: string }
>('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post<LoginResponse>('/user/login', formData);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Me
export const me = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/user/me');
    console.log("res data in /me", res.data);
    return res.data; // keeping this as you said
  } catch (error: any) {
    return rejectWithValue(error.response?.data || '/me route in store failed');
  }
});

// Logout
export const Logout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get<LogoutResponse>('/user/logout');
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Logout failed');
  }
});

export const sendPasswordReset = createAsyncThunk<
  { message?: string },
  string,
  { rejectValue: string }
>('auth/sendPasswordReset', async (email: string, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/user/password/forgot', { email });
    return res.data;
  } catch (error: any) {
    // prefer server message
    console.log("error in the forget pass ",error);
    
    return rejectWithValue(error.response?.data?.message ?? 'Failed to send password reset email');
  }
});

export const resetPassword = createAsyncThunk<
{ message?: string; user?: any },
{ token: string; password: string; confirmPassword: string },
{ rejectValue: string }
>('auth/resetPassword', async ({ token, password, confirmPassword }, { rejectWithValue }) => {
  try {
    console.log("token ",token);
    
    const res = await axiosInstance.put(`/user/password/reset/${token}`, { password, confirmPassword });
    return res.data;
  } catch (error: any) {
    console.log("error in the forget pass ",error);
    
    return rejectWithValue(error.response?.data?.message ?? 'Failed to reset password');
  }
});

// --- Initial State ---
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRefresh: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- Login ---
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
        state.isAuthenticated = false;
      })

      // --- Logout ---
      .addCase(Logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(Logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
      })

      // --- Me ---
      .addCase(me.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.data; // ✅ keeping this as you wanted
        state.isAuthenticated = true;
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Unknown error';
        state.user = null;
        state.isAuthenticated = false;
      })

      // --- sendPasswordReset ---
      .addCase(sendPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // we purposely don't store the message in state; components can use unwrap()
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to send password reset';
      })

      // --- resetPassword ---
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // optionally update user if backend returns one (e.g. logged-in after reset)
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to reset password';
      });
  },
});

// --- Exports ---
export const { authRefresh } = authSlice.actions;
export default authSlice.reducer;
