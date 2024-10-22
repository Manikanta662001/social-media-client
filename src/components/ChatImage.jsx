import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getImageFromDb } from "../utils/utils";
import DownloadIcon from "@mui/icons-material/Download";
import "../pages/chatpage/ChatWindow.css";

const ChatImage = ({ currentUser, singleMessage }) => {
  const { fileLink, from, time } = singleMessage;
  const [imageUrl, setImageUrl] = useState("");
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = singleMessage.content;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    const fetchImage = async () => {
      const url = await getImageFromDb(singleMessage.fileLink);
      setImageUrl(url);
    };
    fetchImage();
  }, [fileLink]);
  console.log("URL::::",imageUrl,singleMessage)
  return (
    <Box className={currentUser._id === from?.id && "user-message"}>
      <Typography component={"p"}>
        <img src={imageUrl} alt="no image" />
        <span>{time}</span>
        <IconButton onClick={handleDownload}>
          <DownloadIcon />
        </IconButton>
      </Typography>
    </Box>
  );
};

export default ChatImage;
