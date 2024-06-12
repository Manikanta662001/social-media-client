import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  InputBase,
  useTheme,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { BE_URL } from "../../utils/constants";
import { useUserContext } from "../../components/authContext/AuthContext";
import { getTokenFromCookie } from "../../utils/utils";
const MyPostWidget = ({ picturePath }) => {
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const token = getTokenFromCookie();
  const { user, setAllPosts } = useUserContext();
  const { _id } = user;
  const { palette } = useTheme();
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  console.log("USER::",user)
  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
      const response = await fetch(BE_URL + `/createPost`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const allPosts = await response.json();
      setAllPosts({ allPosts });
      setImage(null);
      setPost("");
    } catch (error) {
      console.error(error.message);
    }
  };
  return <></>;
};

export default MyPostWidget;
