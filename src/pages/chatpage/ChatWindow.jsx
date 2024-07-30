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
import { formatTime, generateRoomId, getFullName } from "../../utils/utils";
import { useUserContext } from "../../components/authContext/AuthContext";
import "./ChatWindow.css";

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
    const date = new Date().toISOString();
    socket.emit("message", {
      roomId,
      content: messageText,
      from: user,
      to: selectedChatUser,
      date,
    });
    setAllMessages([
      ...allMessages,
      {
        to: { id: selectedChatUser._id, name: getFullName(selectedChatUser) },
        from: { id: user._id, name: getFullName(user) },
        content: messageText,
        time: formatTime(date),
        date,
      },
    ]);
    setMessageText("");
  };
  socket.off("message").on("message", (singleMessage) => {
    const { to } = singleMessage;
    if (user._id === to.id) {
      console.log("ON:::", singleMessage);
      setAllMessages([...allMessages, singleMessage]);
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
    console.log("ALLLL1;;;;", messages);

    setAllMessages(messages);
  });
  console.log("ALLLL;;;;", allMessages);

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
          <Box className="chat-body">
            {allMessages &&
              allMessages?.map((singleMessage, index) => {
                return (
                  <Box
                    className={
                      user._id === singleMessage?.from?.id && "user-message"
                    }
                  >
                    <Typography component={"p"}>
                      {singleMessage.content}
                      <span>{singleMessage.time}</span>
                    </Typography>
                  </Box>
                );
              })}
          </Box>
          <Box
            position={"fixed"}
            bottom={"1px"}
            right={"0"}
            width={isNonMobileScreens ? "calc(100% - 252px)" : "100%"}
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
