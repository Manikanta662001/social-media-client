import React, { useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import {
  Typography,
  IconButton,
  useTheme,
  Box,
  Divider,
  InputBase,
  Button,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubbleOutlineOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { BE_URL } from "../../utils/constants";
import FlexBetween from "../../components/FlexBetween";
import { useUserContext } from "../../components/authContext/AuthContext";
import { getTokenFromCookie, notification } from "../../utils/utils";

const PostWidget = (props) => {
  const {
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
  } = props;

  const [showComments, setShowComments] = useState(false);
  const [userComment, setUserComment] = useState("");
  const { palette } = useTheme();
  const { user, allPosts, setAllPosts } = useUserContext();
  const main = palette.neutral.main;
  const isLiked = Boolean(likes[user._id]);
  const likeCount = Object.keys(likes).length;

  const handleLike = async (postId) => {
    try {
      const response = await fetch(BE_URL + `/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getTokenFromCookie()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
      const post = await response.json();
      const updatedPosts = allPosts.map((eachPost, ind) => {
        if (eachPost._id === post._id) {
          return post;
        }
        return eachPost;
      });
      setAllPosts(updatedPosts);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleAddComment = async (postId) => {
    try {
      const response = await fetch(BE_URL + `/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getTokenFromCookie()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, comment: userComment }),
      });
      const post = await response.json();
      if (!response.ok) {
        throw new Error(post.error);
      }
      const {allPosts,message} = post;
      setAllPosts(allPosts);
      notification(message, "");
      setUserComment('');
    } catch (error) {
      notification("", error.message);
    }
  };
  return (
    <WidgetWrapper m={"2rem 0"}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width={"100%"}
          height={"auto"}
          alt="post"
          src={BE_URL + `/assets/${picturePath}`}
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        />
      )}
      <FlexBetween mt={"0.25rem"}>
        <FlexBetween gap={"1rem"}>
          <FlexBetween gap={"0.3rem"}>
            <IconButton onClick={() => handleLike(postId)}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap={"0.3rem"}>
            <IconButton onClick={() => setShowComments(!showComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {showComments && (
        <Box mt="0.5rem" height={'150px'} overflow={"auto"}>
          <FlexBetween >
            <InputBase
              placeholder="Enter Your Comment"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              sx={{
                width: "70%",
                backgroundColor: palette.neutral.light,
                borderRadius: "1rem",
                padding: "3px 4px",
              }}
            />
            <Button
              onClick={() => handleAddComment(postId)}
              disabled={!userComment.trim()}
              sx={{
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                borderRadius: "3rem",
              }}
            >
              Comment
            </Button>
          </FlexBetween>
          {comments.map((comment, ind) => (
            <Box key={`${name}-${comment}`} mt={"1rem"}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
