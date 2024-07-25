import React from "react";
import FlexBetween from "../../components/FlexBetween";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  InputBase,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ChatWindow = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  return (
    <div>
      <h1>Welcome to Chat 💬 Page</h1>
      <Box
        position={"fixed"}
        bottom={"1px"}
        width={"76%"}
        sx={{ background: neutralLight }}
      >
        <Box
          width="100%"
          padding="2px 0rem"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <Box flexBasis={isNonMobileScreens ? "90%" : undefined} m={"4px 0px"}>
            <InputBase
              placeholder="Search..."
              sx={{
                background: "white",
                padding: "4px 2px",
                borderRadius: "1rem",
              }}
              fullWidth
            />
          </Box>

          <IconButton>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default ChatWindow;
