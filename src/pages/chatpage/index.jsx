import React, { useState } from "react";
import ChatSideBar from "./ChatSideBar";
import { Box, useMediaQuery } from "@mui/material";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [allChatFriends, setAllChatFriends] = useState([]);
  const [chatFriends, setChatFriends] = useState([]);
  return (
    <Box
      width="100%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box flexBasis={isNonMobileScreens ? "24%" : undefined} height={"100vh"}>
        <ChatSideBar
          setSelectedChatUser={setSelectedChatUser}
          allChatFriends={allChatFriends}
          setAllChatFriends={setAllChatFriends}
          chatFriends={chatFriends}
          setChatFriends={setChatFriends}
        />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? "76%" : undefined}
        sx={{ background: "#c9c9c1" }}
      >
        <ChatWindow
          selectedChatUser={selectedChatUser}
          chatFriends={chatFriends}
          setChatFriends={setChatFriends}
        />
      </Box>
    </Box>
  );
};

export default ChatPage;
