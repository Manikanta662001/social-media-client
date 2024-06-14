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
import { getTokenFromCookie, notification } from "../../utils/utils";
import { ToastContainer } from "react-toastify";
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
  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
      }
      const response = await fetch(BE_URL + `/createPost`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const allPosts = await response.json();
      if (!response.ok) {
        throw new Error(allPosts.error);
      }
      const { allDbPosts, message } = allPosts;
      setAllPosts(allDbPosts);
      setImage(null);
      setPost("");
      notification(message, "");
      setIsImage(false);
    } catch (error) {
      notification("", error.message);
      console.error(error.message);
    }
  };
  return (
    <WidgetWrapper>
      <ToastContainer />
      <FlexBetween gap={"1.5rem"}>
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on Your Mind.."
          value={post}
          onChange={(e) => setPost(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius={"5px"}
          mt={"1rem"}
          p={"1rem"}
        >
          <Dropzone
            accept={{
              "image/jpeg": ["jpeg", "jpg"],
              "image/png": ["png"],
            }}
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px solid ${palette.primary.main}`}
                  p={"1rem"}
                  width={"100%"}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton>
                    <DeleteOutlined
                      onClick={() => setImage(null)}
                      // sx={{ width: "15%" }}
                    />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween gap={"0.5rem"} onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreen ? (
          <>
            <FlexBetween gap={"0.25rem"}>
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>
            <FlexBetween gap={"0.25rem"}>
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>
            <FlexBetween gap={"0.25rem"}>
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap={"0.25rem"}>
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}
        <Button
          disabled={!post.trim()}
          onClick={handleCreatePost}
          sx={{
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
