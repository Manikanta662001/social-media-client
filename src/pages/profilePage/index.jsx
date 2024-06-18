import React, { useEffect, useState } from "react";
import { BE_URL } from "../../utils/constants";
import { getTokenFromCookie } from "../../utils/utils";
import { useParams } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import { useUserContext } from "../../components/authContext/AuthContext";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import AdvertWidget from "../widgets/AdvertWidget";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const { userId } = useParams();
  const { user } = useUserContext();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const sameUserOrNot = user._id === userId;
  const getUser = async () => {
    try {
      const response = await fetch(BE_URL + `/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
      });
      const userData = await response.json();
      if (!response.ok) {
        throw new Error(userData.error);
      }
      setProfile(userData);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  if (!profile) {
    return null;
  }
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={profile?.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {sameUserOrNot && <MyPostWidget picturePath={profile?.picturePath} />}
          <Box m="2rem 0" />
          <PostsWidget
            userId={userId}
            isProfile
            sameUserOrNot={sameUserOrNot}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default ProfilePage;
