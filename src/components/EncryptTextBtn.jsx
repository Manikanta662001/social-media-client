import { Box, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import React from "react";

const EncryptTextBtn = () => {
  return (
    <Box className={"encrypt-txt-wrapper"}>
      <Typography component={"p"}>
        <LockIcon /> Messages are end-to-end-encrypted. No one outside of this
        chat, not even Whatsapp, can read or listen to them.
      </Typography>
    </Box>
  );
};

export default EncryptTextBtn;
