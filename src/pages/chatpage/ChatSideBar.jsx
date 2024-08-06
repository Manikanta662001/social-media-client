import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../components/authContext/AuthContext";
import { getFullName, getUserFriends } from "../../utils/utils";
import { Box, IconButton, InputBase, TextField, useTheme } from "@mui/material";
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
  const { user } = useUserContext();
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
      getFullName(user).toLowerCase().includes(searchedUser.toLowerCase())
    );
    setChatFriends(users);
  }, [searchedUser]);
  return (
    <>
      {loading ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <FlexBetween borderBottom={"1px solid lightgrey"}>
            <IconButton onClick={handleBack}>
              <KeyboardBackspaceIcon />
            </IconButton>
            <Box padding={"8px 5px"}>
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
