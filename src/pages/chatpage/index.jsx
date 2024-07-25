import React from "react";
import ChatSideBar from "./ChatSideBar";
import { Box, useMediaQuery } from "@mui/material";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box
      width="100%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box flexBasis={isNonMobileScreens ? "24%" : undefined}>
        <ChatSideBar />
      </Box>
      <Box flexBasis={isNonMobileScreens ? "76%" : undefined}>
        <ChatWindow />
      </Box>
    </Box>
  );
};

export default ChatPage;
