import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../components/authContext/AuthContext";
import { getFullName, getUserFriends } from "../../utils/utils";
import {
  Box,
  IconButton,
  InputBase,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChatUserWidget from "../widgets/ChatUserWidget";
import FlexBetween from "../../components/FlexBetween";
import { Search } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./ChatSideBar.css";

const ChatSideBar = (props) => {
  const {
    setSelectedChatUser,
    allChatFriends,
    setAllChatFriends,
    chatFriends,
    setChatFriends,
  } = props;
  const { user, setUser, socket } = useUserContext();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { _id } = user;
  const [loading, setLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const handleBack = () => {
    socket.emit("updateLastSeen", {
      selectedId: _id,
      lastSeen: new Date(),
    });
    navigate(-1);
  };

  useEffect(() => {
    const friendsFn = async () => {
      const result = await getUserFriends(_id);
      setChatFriends(result);
      setAllChatFriends(result);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };
    friendsFn();
  }, []);

  useEffect(() => {
    const users = allChatFriends.filter((user) =>
      getFullName(user).toLowerCase().includes(searchedUser.toLowerCase()),
    );
    setChatFriends(users);
  }, [searchedUser]);

  socket.off("msgCount").on("msgCount", ({ from, receipientUser }) => {
    if (user._id === from) {
      setUser((prevUser) => ({
        ...prevUser,
        messageCount: receipientUser.messageCount,
      }));
    }
    const allFriends = chatFriends.map((item) => {
      if (item._id === receipientUser._id) {
        return receipientUser;
      }
      return item;
    });
    setChatFriends(allFriends);
  });
  socket
    .off("updateLastSeen")
    .on("updateLastSeen", ({ id, receipientUser }) => {
      if (user._id === id) {
        setUser((prevUser) => ({
          ...prevUser,
          messageCount: receipientUser.lastSeen,
        }));
      }
      const allFriends = chatFriends.map((item) => {
        if (item._id === receipientUser._id) {
          return receipientUser;
        }
        return item;
      });
      setChatFriends(allFriends);
    });
  return (
    <>
      {loading ? (
        <Box textAlign={"center"} position={"relative"} top={"50%"}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          <FlexBetween borderBottom={"1px solid lightgrey"}>
            <IconButton onClick={handleBack} title="back">
              <KeyboardBackspaceIcon />
            </IconButton>
            <Box padding={"8px 5px"} width={"100%"}>
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                gap="2rem"
                padding="0.1rem 1.5rem"
              >
                <IconButton>
                  <Search />
                </IconButton>
                <InputBase
                  placeholder="Search..."
                  fullWidth
                  value={searchedUser}
                  onChange={(e) => setSearchedUser(e.target.value)}
                />
              </FlexBetween>
            </Box>
          </FlexBetween>

          <Box
            display={"flex"}
            flexDirection={"column"}
            className="chat-sidebar"
          >
            {chatFriends.length > 0 ? (
              chatFriends.map((eachFriend, ind) => {
                return (
                  <ChatUserWidget
                    key={"sidebar" + eachFriend.firstName}
                    eachFriend={eachFriend}
                    setSelectedChatUser={setSelectedChatUser}
                    setSearchedUserText={setSearchedUser}
                  />
                );
              })
            ) : (
              <p style={{ margin: "auto" }}>No Results</p>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default ChatSideBar;
