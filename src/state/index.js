import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      const { friends } = action.payload;
      if (state.user) {
        state.user.friends = friends;
      } else {
        console.error("User does not exist");
      }
    },
    setAllPosts: (state, action) => {
      const { allPosts } = action.payload;
      state.posts = allPosts;
    },
    updatePost: (state, action) => {
      const { post_id, post } = action.payload;
      const updatedPosts = state.posts.map((onepost) => {
        if (onepost._id === post_id) return post;
        return onepost;
      });
      state.posts = updatedPosts;
    },
  },
});
export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setAllPosts,
  updatePost,
} = authSlice.actions;
export default authSlice.reducer;
