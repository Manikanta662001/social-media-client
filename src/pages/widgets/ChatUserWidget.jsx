import React from "react";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { Box, Typography, useTheme } from "@mui/material";
import { getFullName, getLastSeenTime } from "../../utils/utils";
import { useUserContext } from "../../components/authContext/AuthContext";

const ChatUserWidget = ({
  eachFriend,
  setSelectedChatUser,
  setSearchedUserText,
}) => {
  const { _id, firstName, lastName, picturePath, messageCount, lastSeen } =
    eachFriend;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const neutralLight = palette.neutral.light;
  const { socket, roomId } = useUserContext();
  const handleSelectedUser = () => {
    setSelectedChatUser(eachFriend);
    setSearchedUserText("");
    socket.emit("clearMsgCount", {
      roomId,
      userId: _id,
    });
  };
  return (
    <FlexBetween
      sx={{
        "&:hover": { background: "lightGrey", cursor: "pointer" },
      }}
      padding={"10px"}
      borderBottom={`1px solid ${neutralLight}`}
      onClick={() => {
        handleSelectedUser();
      }}
    >
      <FlexBetween width={"100%"}>
        <FlexBetween gap={"1.5rem"}>
          <UserImage image={picturePath} size={"40px"} />
          <Box onClick={() => console.log("first")}>
            <Typography color={main} variant="h5" fontWeight={"500"}>
              {getFullName(eachFriend)}
            </Typography>
            {/* <Typography color={medium} fontSize={"0.75rem"}>
              hello
            </Typography> */}
          </Box>
        </FlexBetween>
        <FlexBetween>
          <Box onClick={() => console.log("first")}>
            <Typography component={"h6"}>
              {getLastSeenTime(lastSeen)}
            </Typography>
            <Typography
              color={"white"}
              fontSize={"0.75rem"}
              textAlign={"center"}
            >
              {messageCount > 0 && (
                <Typography
                  component={"span"}
                  sx={{ background: "green" }}
                  borderRadius={"40%"}
                  padding={"1px 3px"}
                >
                  {messageCount}
                </Typography>
              )}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>
    </FlexBetween>
  );
};

export default ChatUserWidget;
