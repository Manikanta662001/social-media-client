import React from "react";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { PersonRemoveOutlined, PersonAddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./authContext/AuthContext";
import { getTokenFromCookie, notification } from "../utils/utils";
import { BE_URL } from "../utils/constants";

const Friend = (props) => {
  const { friendId, name, subtitle, userPicturePath } = props;
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { user, setUser } = useUserContext();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriendOrNot = user.friends.find((item) => item === friendId);

  const handleAddOrRemoveFriend = async () => {
    try {
      const response = await fetch(BE_URL + `/users/${user._id}/${friendId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error);
      }
      const { message, formatedFriends } = result;
      if (user) {
        setUser({ ...user, friends: formatedFriends });
      }
      notification(message, "");
    } catch (error) {
      notification("", error.message);
    }
  };
  return (
    <>
      <FlexBetween>
        <FlexBetween gap={"1rem"}>
          <UserImage image={userPicturePath} size={"55px"} />
          <Box onClick={() => navigate(`/profile/${friendId}`)}>
            <Typography
              color={main}
              variant="h5"
              fontWeight={"500"}
              sx={{
                "&:hover": { color: palette.primary.main, cursor: "pointer" },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize={"0.75rem"}>
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
        <IconButton
          sx={{ color: primaryLight, p: "0.6rem" }}
          onClick={handleAddOrRemoveFriend}
        >
          {isFriendOrNot !== undefined ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      </FlexBetween>
    </>
  );
};

export default Friend;
