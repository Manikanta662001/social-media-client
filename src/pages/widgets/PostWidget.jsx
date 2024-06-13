import React, { useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import { Typography, IconButton, useTheme, Box, Divider } from "@mui/material";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubbleOutlineOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { BE_URL } from "../../utils/constants";
import FlexBetween from "../../components/FlexBetween";
import { useUserContext } from "../../components/authContext/AuthContext";

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
  const { palette } = useTheme();
  const { user } = useUserContext();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const isLiked = Boolean(likes[user._id]);
  const likeCount = Object.keys(likes).length;
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
            <IconButton>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
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
        <Box mt="0.5rem">
          {comments.map((comment, ind) => (
            <Box key={`${name}-${comment}`}>
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
