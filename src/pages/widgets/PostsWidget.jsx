import React, { useEffect, useState } from "react";
import { BE_URL } from "../../utils/constants";
import { getFullName, getTokenFromCookie } from "../../utils/utils";
import { useUserContext } from "../../components/authContext/AuthContext";
import PostWidget from "./PostWidget";
import { Box, CircularProgress } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false, sameUserOrNot = true }) => {
  const { allPosts, setAllPosts } = useUserContext();
  const [loading, setLoading] = useState(true);
  const getPosts = async () => {
    try {
      const response = await fetch(BE_URL + "/posts/", {
        headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
      });
      const posts = await response.json();
      setAllPosts(posts);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getUserPosts = async () => {
    try {
      const response = await fetch(BE_URL + `/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
      });
      const posts = await response.json();
      setAllPosts(posts);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);
  return (
    <>
      <Box position={"relative"} minHeight={"300px"}>
        {loading && (
          <Box
            position={"absolute"}
            top={"calc(50% - 20px)"}
            right={"calc(50% - 20px)"}
          >
            <CircularProgress />
          </Box>
        )}
        {allPosts &&
          allPosts?.map((post, ind) => (
            <PostWidget
              key={post._id}
              postId={post._id}
              postUserId={post.userId}
              name={getFullName(post)}
              description={post.description}
              location={post.location}
              picturePath={post.picturePath}
              userPicturePath={post.userPicturePath}
              likes={post.likes}
              comments={post.comments}
              sameUserOrNot={sameUserOrNot}
            />
          ))}
      </Box>
    </>
  );
};

export default PostsWidget;
