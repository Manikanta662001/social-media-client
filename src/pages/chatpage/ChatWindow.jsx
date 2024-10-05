import React, { useEffect, useRef, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UserImage from "../../components/UserImage";
import { formatTime, generateRoomId, getFullName } from "../../utils/utils";
import { useUserContext } from "../../components/authContext/AuthContext";
import "./ChatWindow.css";
import { BE_URL } from "../../utils/constants";
import ChatImage from "../../components/ChatImage";
import EmojiPickerButton from "../../components/EmojiPickerButton";

const ChatWindow = ({ selectedChatUser, chatFriends, setChatFriends }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [showArrowIcon, setShowArrowIcon] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const chatBodyRef = useRef(null);
  const fileInputref = useRef(null);
  const theme = useTheme();
  const { user, socket } = useUserContext();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;
  const chatHeight = chatBodyRef?.current?.scrollHeight;

  const handleSendMessage = (
    e,
    messageType = "message",
    fileLink = "",
    text
  ) => {
    e.preventDefault();
    if (
      (messageType === "message" && messageText.trim() !== "") ||
      messageType === "image"
    ) {
      const date = new Date().toISOString();
      const sendingMsg = {
        from: { id: user._id, name: getFullName(user) },
        to: { id: selectedChatUser._id, name: getFullName(selectedChatUser) },
        content: messageText || text,
        date,
        time: formatTime(date),
        type: messageType,
        fileLink,
      };
      socket.emit("message", { ...sendingMsg, roomId });
      setAllMessages([...allMessages, sendingMsg]);
      //we are moving the selectedChatUser to top
      const selectedUserIndex = chatFriends.findIndex(
        (user) => user._id === selectedChatUser._id
      );
      if (selectedUserIndex !== 0) {
        const clonedObj = [...chatFriends];
        clonedObj.splice(selectedUserIndex, 1);
        clonedObj.unshift(selectedChatUser);
        setChatFriends(clonedObj);
        setMessageText("");
      }
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
    console.log("SCROLL::::", {
      scrollTop,
      scrollHeight,
      clientHeight,
    });
    if (scrollTop + clientHeight <= scrollHeight - 100) {
      setShowArrowIcon(true);
    } else {
      setShowArrowIcon(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleImageClick = () => {
    fileInputref.current.click();
  };
  const handleFileSelect = async (e) => {
    handleMenuClose();
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("picture", selectedFile);
        const response = await fetch(BE_URL + "/file", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        handleSendMessage(e, "image", result._id, selectedFile.name);
      } catch (error) {}
    }
  };

  socket.off("message").on("message", (singleMessage) => {
    const { to } = singleMessage;
    if (user._id === to.id) {
      setAllMessages([...allMessages, singleMessage]);
    }
  });

  useEffect(() => {
    if (selectedChatUser) {
      const generatedRoomId = generateRoomId(user, selectedChatUser);
      setRoomId(generatedRoomId);
      socket.emit("allmsgs", {
        roomId: generatedRoomId,
      });
      if (roomId) {
        socket.emit("leaveRoom", { roomId });
      }
      socket.emit("joinRoom", {
        roomId: generateRoomId(user, selectedChatUser),
      });
      //ADDING SCROLL EVENT TO CHAT BODY WHEN USER SELECTS A CHAT USER
      chatBodyRef.current?.addEventListener("scroll", handleScroll);
      return () => {
        chatBodyRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedChatUser]);

  socket.off("getallmsgs").on("getallmsgs", ({ messages }) => {
    setAllMessages(messages);
  });

  useEffect(() => {
    if (chatBodyRef.current) {
      const chatBodyElement = chatBodyRef.current;
      setTimeout(() => {
        chatBodyElement.scrollTo({
          top: chatBodyElement.scrollHeight,
          behavior: "smooth",
        });
      }, 1000);
    }
  }, [allMessages]);

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
          <Box className="chat-body" ref={chatBodyRef}>
            {showArrowIcon && (
              <IconButton className="down-arrow">
                <KeyboardDoubleArrowDownIcon />
              </IconButton>
            )}
            {allMessages &&
              allMessages?.map((singleMessage, index) => {
                if (singleMessage.type === "message") {
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
                } else if (singleMessage.type === "image") {
                  return (
                    <ChatImage
                      currentUser={user}
                      singleMessage={singleMessage}
                    />
                  );
                }
              })}
            <div></div>
          </Box>
          <Box
            position={"fixed"}
            bottom={"1px"}
            right={"0"}
            width={isNonMobileScreens ? "calc(100% - 24.5%)" : "100%"}
            sx={{ background: neutralLight }}
          >
            <Box
              width="100%"
              padding="2px 0rem"
              display={"flex"}
              gap="0.5rem"
              justifyContent="space-between"
            >
              <IconButton onClick={handleMenuOpen}>
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
                  <EmojiPickerButton />
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
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleImageClick}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputref}
                onChange={handleFileSelect}
              />
              Image
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Typography variant="h1" textAlign={"center"}>
          Welcome to Chat 💬 Page
        </Typography>
      )}
    </div>
  );
};

export default ChatWindow;
