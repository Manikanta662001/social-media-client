import React, { useEffect, useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Box, Typography, useTheme } from "@mui/material";
import { useUserContext } from "../../components/authContext/AuthContext";
import Friend from "../../components/Friend";
import { getFullName, getTokenFromCookie } from "../../utils/utils";
import { BE_URL } from "../../utils/constants";

const FriendListWidget = ({ userId }) => {
  const { palette } = useTheme();
  const { user } = useUserContext();
  const [userFriends, setUserFriends] = useState([]);
  const getFriends = async () => {
    try {
      const response = await fetch(BE_URL + `/users/${userId}/friends`, {
        headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
      });
      const result = await response.json();
      setUserFriends(result);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getFriends();
  }, [user]);
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friends List
      </Typography>
      <Box display={"flex"} flexDirection={"column"} gap={"1.5rem"}>
        {userFriends?.map((fri, ind) => (
          <Friend
            friendId={fri._id}
            name={getFullName(fri)}
            subtitle={fri.location}
            userPicturePath={fri.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
