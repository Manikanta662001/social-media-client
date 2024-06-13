import React, { useState, useEffect } from "react";
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, useTheme, Divider } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { BE_URL } from "../../utils/constants";
import { getFullName, getTokenFromCookie } from "../../utils/utils";
import twitter from "../../assets/twitter.png";
import linkedin from "../../assets/linkedin.png";
import { useUserContext } from "../../components/authContext/AuthContext";

const UserWidget = ({ userId, picturePath }) => {
  const [profile, setProfile] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = getTokenFromCookie();
  const { user } = useUserContext();
  // const { _id } = user;
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const getUser = async () => {
    try {
      const response = await fetch(BE_URL + `/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
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
  }, [user]);
  return (
    <>
      {profile ? (
        <WidgetWrapper>
          {/* FIRST ROW */}
          <FlexBetween
            gap="0.5rem"
            pb="1.1rem"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            <FlexBetween gap={"1rem"}>
              <UserImage image={picturePath} />
              <Box>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {getFullName(profile)}
                </Typography>
                <Typography color={medium}>
                  {profile?.friends?.length} friends
                </Typography>
              </Box>
            </FlexBetween>
            <ManageAccountsOutlined />
          </FlexBetween>
          <Divider />
          {/* SECOND ROW */}
          <Box p={"1rem 0"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={"1rem"}
              mb={"0.5rem"}
            >
              <LocationOnOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{profile.location}</Typography>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={"1rem"}
              mb={"0.5rem"}
            >
              <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{profile.occupation}</Typography>
            </Box>
          </Box>
          <Divider />

          {/* THIRD ROW */}
          <Box p={"1rem 0"}>
            <FlexBetween mb={"0.5rem"}>
              <Typography color={medium}>Who's viewed your profile:</Typography>
              <Typography color={medium} fontWeight={"500"}>
                {user.viewedProfile}
              </Typography>
            </FlexBetween>
            <FlexBetween mb={"0.5rem"}>
              <Typography color={medium}>Impressions of your post:</Typography>
              <Typography color={medium} fontWeight={"500"}>
                {user.impressions}
              </Typography>
            </FlexBetween>
          </Box>
          <Divider />

          {/* FOURTH ROW */}
          <Box p={"1rem 0"}>
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
              Social Profiles
            </Typography>
            <FlexBetween gap={"1rem"} mb={"0.5rem"}>
              <FlexBetween gap={"1rem"}>
                <img src={twitter} alt="twitter" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    Twitter
                  </Typography>
                  <Typography color={medium}>Social Network</Typography>
                </Box>
              </FlexBetween>
              <EditOutlined sx={{ color: main }} />
            </FlexBetween>
            <FlexBetween gap="1rem">
              <FlexBetween gap="1rem">
                <img src={linkedin} alt="linkedin" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    Linkedin
                  </Typography>
                  <Typography color={medium}>Network Platform</Typography>
                </Box>
              </FlexBetween>
              <EditOutlined sx={{ color: main }} />
            </FlexBetween>
          </Box>
        </WidgetWrapper>
      ) : null}
    </>
  );
};
export default UserWidget;
