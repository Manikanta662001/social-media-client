import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getImageFromDb } from "../utils/utils";
import "../pages/chatpage/ChatWindow.css";

const ChatImage = ({ currentUser, singleMessage }) => {
  const { fileLink, from, time } = singleMessage;
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    const fetchImage = async () => {
      const url = await getImageFromDb(singleMessage.fileLink);
      setImageUrl(url);
    };
    fetchImage();
  }, [fileLink]);
  return (
    <Box className={currentUser._id === from?.id && "user-message"}>
      <Typography component={"p"}>
        <img src={imageUrl} alt="no image" />
        <span>{time}</span>
      </Typography>
    </Box>
  );
};

export default ChatImage;
