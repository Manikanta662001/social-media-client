import React, { useCallback, useEffect, useRef, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

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
import {
  debounce,
  formatTime,
  generateRoomId,
  getFullName,
} from "../../utils/utils";
import { useUserContext } from "../../components/authContext/AuthContext";
import "./ChatWindow.css";
import { BE_URL } from "../../utils/constants";
import ChatImage from "../../components/ChatImage";
import EmojiPickerButton from "../../components/EmojiPickerButton";
import DateButton from "../../components/DateButton";
import EncryptTextBtn from "../../components/EncryptTextBtn";
import { useNavigate } from "react-router-dom";
import LoadingDots from "../../components/LoadingDots ";

const ChatWindow = ({
  selectedChatUser,
  chatFriends,
  setChatFriends,
  setSelectedChatUser,
}) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [showArrowIcon, setShowArrowIcon] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [msgTyping, setMsgTyping] = useState(false);
  const open = Boolean(anchorEl);
  const chatBodyRef = useRef(null);
  const imageInputref = useRef(null);
  const fileInputref = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, socket, roomId, setRoomId } = useUserContext();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  // const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;
  // const chatHeight = chatBodyRef?.current?.scrollHeight;

  const handleSendMessage = (
    e,
    messageType = "message",
    fileLink = "",
    text
  ) => {
    e.preventDefault();
    if (
      (messageType === "message" && messageText.trim() !== "") ||
      messageType === "image" ||
      messageType === "document"
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
      setMessageText("");
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
  const handleMenuItemClick = (name) => {
    if (name === "image") {
      imageInputref.current.click();
    } else {
      fileInputref.current.click();
    }
  };
  const handleFileSelect = async (e, name) => {
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
        handleSendMessage(e, name, result._id, selectedFile.name);
      } catch (error) {}
    }
  };
  const handleDownArrowClick = () => {
    const chatBodyElement = chatBodyRef.current;
    setTimeout(() => {
      chatBodyElement.scrollTo({
        top: chatBodyElement.scrollHeight,
        behavior: "smooth",
      });
    }, 300);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleBack = () => {
    socket.emit("updateLastSeen", {
      selectedId: user._id,
      lastSeen: new Date(),
    });
    socket.emit("leaveRoom", { roomId });
    setSelectedChatUser(null);
  };
  const handleInputBlur = () => {
    socket.emit("msgnottyping", {
      roomId,
      to: selectedChatUser._id,
    });
  };

  const handleInputKeyDown = (e) => {
    socket.emit("msgtyping", {
      roomId,
      to: selectedChatUser._id,
    });
  };
  // Debounced function for emitting "msgnottyping"
  const emitNotTyping = useCallback(
    debounce((id) => {
      socket.emit("msgnottyping", {
        roomId,
        to: id,
      });
      setMsgTyping(false);
    }, 2000),
    [selectedChatUser?._id]
  );
  socket.off("message").on("message", (singleMessage) => {
    const { to } = singleMessage;
    if (user._id === to.id) {
      setMsgTyping(false);
      setAllMessages([...allMessages, singleMessage]);
    }
  });
  socket.off("msgtyping").on("msgtyping", ({ roomId, to }) => {
    if (user._id === to) {
      setMsgTyping(true);
      emitNotTyping(selectedChatUser?._id);
    }
  });
  socket.off("msgnottyping").on("msgnottyping", ({ roomId, to }) => {
    if (user._id === to) {
      setMsgTyping(false);
    }
  });

  useEffect(() => {
    if (selectedChatUser) {
      setMessageText("");
      setAllMessages([]);
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
        //eslint-disable-next-line
        chatBodyRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
    //eslint-disable-next-line
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
  useEffect(() => {
    if (chatBodyRef.current) {
      const chatBodyElement = chatBodyRef.current;
      const { scrollTop, scrollHeight, clientHeight } = chatBodyElement;
      if (clientHeight + scrollTop >= scrollHeight - 70) {
        setTimeout(() => {
          chatBodyElement.scrollTo({
            top: chatBodyElement.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [msgTyping]);
  return (
    <div className={!selectedChatUser && "wrapper-div"}>
      {selectedChatUser ? (
        <div style={{ position: "relative" }}>
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
                {!isNonMobileScreens && (
                  <IconButton onClick={handleBack} title="back">
                    <KeyboardBackspaceIcon />
                  </IconButton>
                )}
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
              <IconButton className="down-arrow" onClick={handleDownArrowClick}>
                <KeyboardDoubleArrowDownIcon />
              </IconButton>
            )}
            <EncryptTextBtn />
            {allMessages &&
              //eslint-disable-next-line
              allMessages?.map((singleMessage, index) => {
                if (singleMessage.type === "message") {
                  return (
                    <>
                      <DateButton
                        currentDate={singleMessage?.date}
                        previousDate={allMessages[index - 1]?.date}
                      />
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
                    </>
                  );
                } else if (
                  singleMessage.type === "image" ||
                  singleMessage.type === "document"
                ) {
                  return (
                    <>
                      <DateButton
                        currentDate={singleMessage?.date}
                        previousDate={allMessages[index - 1]?.date}
                      />
                      <ChatImage
                        currentUser={user}
                        singleMessage={singleMessage}
                      />
                    </>
                  );
                }
              })}
            {msgTyping && <LoadingDots />}
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
                    placeholder="Enter Message..."
                    fullWidth
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
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
            <MenuItem onClick={() => handleMenuItemClick("image")}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={imageInputref}
                onChange={(e) => handleFileSelect(e, "image")}
                accept=".png,.jpg,.jpeg,.gif"
              />
              Image
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("document")}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputref}
                onChange={(e) => handleFileSelect(e, "document")}
                accept=".pdf,.txt,.doc,.docx"
              />
              Document
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <Typography
          variant="h1"
          textAlign={"center"}
          display={!isNonMobileScreens && "none"}
        >
          Welcome to Chat 💬 Page
        </Typography>
      )}
    </div>
  );
};

export default ChatWindow;
