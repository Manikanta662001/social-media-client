import React, { useEffect, useState } from "react";
import { useUserContext } from "../../components/authContext/AuthContext";
import { getUserFriends } from "../../utils/utils";
import { Box, IconButton, InputBase, TextField, useTheme } from "@mui/material";
import ChatUserWidget from "../widgets/ChatUserWidget";
import FlexBetween from "../../components/FlexBetween";
import { Search } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import "./ChatSideBar.css";

const ChatSideBar = ({ setSelectedChatUser }) => {
  const { user } = useUserContext();
  const { _id } = user;
  const [loading, setLoading] = useState(true);
  const [allChatFriends, setAllChatFriends] = useState([]);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  useEffect(() => {
    const friendsFn = async () => {
      const result = await getUserFriends(_id);
      setAllChatFriends(result);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };
    friendsFn();
  }, []);
  console.log("CHAT:::", loading, allChatFriends);
  return (
    <>
      {loading ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <Box padding={"8px 5px"} borderBottom={"1px solid lightgrey"}>
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="2rem"
              padding="0.1rem 1.5rem"
            >
              <IconButton>
                <Search />
              </IconButton>
              <InputBase placeholder="Search..." fullWidth />
            </FlexBetween>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            className="chat-sidebar"
          >
            {allChatFriends?.map((eachFriend, ind) => {
              return (
                <ChatUserWidget
                  key={"sidebar" + eachFriend.firstName}
                  eachFriend={eachFriend}
                  setSelectedChatUser={setSelectedChatUser}
                />
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};

export default ChatSideBar;
