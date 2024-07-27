import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UserImage from "../../components/UserImage";
import { generateRoomId, getFullName } from "../../utils/utils";
import { useUserContext } from "../../components/authContext/AuthContext";

const ChatWindow = ({ selectedChatUser }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const theme = useTheme();
  const { user, socket } = useUserContext();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;

  const handleSendMessage = (e) => {
    e.preventDefault();
    const roomId = generateRoomId(user, selectedChatUser);
    console.log("ROOMID:::", roomId);
    socket.emit("message", {
      roomId,
      content: messageText,
      from: user,
      to: selectedChatUser,
      date: new Date(),
    });
    setAllMessages([
      ...allMessages,
      {
        to: { id: selectedChatUser._id, name: getFullName(selectedChatUser) },
        content: messageText,
      },
    ]);
    setMessageText("");
  };
  socket.off("message").on("message", ({ to, content }) => {
    if (user._id === to.id) {
      console.log("ON:::", { to, content });
      setAllMessages([...allMessages, { to, content }]);
    }
  });

  useEffect(() => {
    if (selectedChatUser) {
      socket.emit("allmsgs", {
        roomId: generateRoomId(user, selectedChatUser),
      });
    }
  }, [selectedChatUser]);

  socket.off("getallmsgs").on("getallmsgs", ({ messages }) => {
  console.log("ALLLL1;;;;",messages)

    setAllMessages(messages);
  });
  console.log("ALLLL;;;;",allMessages)

  return (
    <div>
      {selectedChatUser ? (
        <>
          <Box
            padding={"8px 5px"}
            borderBottom={"1px solid lightgrey"}
            backgroundColor={neutralLight}
          >
            <FlexBetween
              gap="2rem"
              padding="1px 1rem"
              justifyContent={"space-around"}
              alignItems={"center"}
            >
              <FlexBetween gap={"1.5rem"}>
                <UserImage image={selectedChatUser.picturePath} size={"40px"} />
                <Box>
                  <Typography color={main} variant="h5" fontWeight={"500"}>
                    {getFullName(selectedChatUser)}
                  </Typography>
                </Box>
              </FlexBetween>
              <Box>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </FlexBetween>
          </Box>
          <Box
            position={"fixed"}
            bottom={"1px"}
            width={isNonMobileScreens ? "76%" : "100%"}
            sx={{ background: neutralLight }}
          >
            <Box
              width="100%"
              padding="2px 0rem"
              display={"flex"}
              gap="0.5rem"
              justifyContent="space-between"
            >
              <IconButton>
                <AttachFileIcon sx={{ color: dark }} />
              </IconButton>
              <Box flexBasis={"90%"} m={"4px 0px"}>
                <FlexBetween
                  gap="2rem"
                  padding="0.1rem 1.5rem"
                  sx={{
                    background: "white",
                    padding: "3px 2px",
                    borderRadius: "1rem",
                  }}
                >
                  <IconButton>
                    <InsertEmoticonIcon />
                  </IconButton>
                  <InputBase
                    placeholder="Search..."
                    fullWidth
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </FlexBetween>
              </Box>

              <IconButton onClick={handleSendMessage}>
                <SendIcon sx={{ color: "green" }} />
              </IconButton>
            </Box>
          </Box>
        </>
      ) : (
        <h1>Welcome to Chat 💬 Page</h1>
      )}
    </div>
  );
};

export default ChatWindow;
