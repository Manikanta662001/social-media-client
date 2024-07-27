import React from "react";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { Box, Typography, useTheme } from "@mui/material";
import { getFullName } from "../../utils/utils";

const ChatUserWidget = ({ eachFriend, setSelectedChatUser }) => {
  const { _id, firstName, lastName, picturePath } = eachFriend;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const neutralLight = palette.neutral.light;
  return (
    <FlexBetween
      sx={{
        "&:hover": { background: "lightGrey", cursor: "pointer" },
      }}
      padding={"10px"}
      borderBottom={`1px solid ${neutralLight}`}
      onClick={() => setSelectedChatUser(eachFriend)}
    >
      <FlexBetween width={"100%"}>
        <FlexBetween gap={"1.5rem"}>
          <UserImage image={picturePath} size={"40px"} />
          <Box onClick={() => console.log("first")}>
            <Typography color={main} variant="h5" fontWeight={"500"}>
              {getFullName(eachFriend)}
            </Typography>
            <Typography color={medium} fontSize={"0.75rem"}>
              hello
            </Typography>
          </Box>
        </FlexBetween>
        <FlexBetween>
          <Box onClick={() => console.log("first")}>
            <Typography component={"h6"}>12:56</Typography>
            <Typography
              color={"white"}
              fontSize={"0.75rem"}
              textAlign={"center"}
            >
              <Typography
                component={"span"}
                sx={{ background: "green" }}
                borderRadius={"40%"}
                padding={"1px 3px"}
              >
                3
              </Typography>
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>
    </FlexBetween>
  );
};

export default ChatUserWidget;
