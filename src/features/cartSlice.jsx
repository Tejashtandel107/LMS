// src/redux/cartSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Get logged-in user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !token) return [];

      const res = await axios.get(
        `${BASE_URL}/api/carts?filters[user][id][$eq]=${user.id}&populate[course][populate][thumbnail]=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add course to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (courseId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !token) {
        return rejectWithValue("User not logged in");
      }

      await axios.post(
        `${BASE_URL}/api/carts`,
        {
          data: {
            user: user.id,
            course: courseId,
            createAt: new Date().toISOString()
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchCart());
      return courseId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove course from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartDocumentId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/carts/${cartDocumentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(fetchCart());
      return cartDocumentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;