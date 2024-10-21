import React, { useEffect, useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Box, Typography, useTheme } from "@mui/material";
import { useUserContext } from "../../components/authContext/AuthContext";
import Friend from "../../components/Friend";
import { getFullName, getUserFriends } from "../../utils/utils";

const FriendListWidget = ({ userId }) => {
  const { palette } = useTheme();
  const { user } = useUserContext();
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const friendsFn = async () => {
      const result = await getUserFriends(userId);
      setUserFriends(result);
    };
    friendsFn();
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
        {userFriends?.map((fri, ind) => {
          const sameUserOrNot = fri._id !== user._id;
          return (
            <Friend
              key={fri._id + fri.firstName}
              friendId={fri._id}
              name={getFullName(fri)}
              subtitle={fri.location}
              userPicturePath={fri.picturePath}
              sameUserOrNot={sameUserOrNot}
            />
          );
        })}
        {userFriends.length == 0 && (
          <Typography component={"p"}>There are No Friends🙁.</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
