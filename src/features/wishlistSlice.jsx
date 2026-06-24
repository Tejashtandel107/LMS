import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `${BASE_URL}/api/wishlists?filters[user][id][$eq]=${user.id}&populate[course][populate]=thumbnail&populate[course][populate][enrollments]=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch wishlist"
      );
    }
  }
);

export const wishlist = createAsyncThunk(
  "wishlist/toggle",
  async (course, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const checkRes = await axios.get(
        `${BASE_URL}/api/wishlists?filters[user][id][$eq]=${user.id}&filters[course][id][$eq]=${course.id}&populate=*`,
        { headers }
      );

      const existingItem = checkRes.data.data[0];

      if (existingItem) {
        await axios.delete(
          `${BASE_URL}/api/wishlists/${existingItem.documentId}`,
          { headers }
        );

        return {
          status: "removed",
          courseId: course.id,
          wishlistId: existingItem.documentId,
        };
      }

      const addRes = await axios.post(
        `${BASE_URL}/api/wishlists`,
        {
          data: {
            user: user.id,
            course: course.id,
          },
        },
        { headers }
      );

      return {
        status: "added",
        item: {
          ...addRes.data.data,
          course: course,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(wishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(wishlist.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "added") {
          state.items.push(action.payload.item);
        }

        if (action.payload.status === "removed") {
          state.items = state.items.filter(
            (item) =>
              item.documentId !== action.payload.wishlistId &&
              item.course?.id !== action.payload.courseId
          );
        }
      })
      .addCase(wishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;