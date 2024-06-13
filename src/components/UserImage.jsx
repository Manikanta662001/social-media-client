import React from "react";
import { Box } from "@mui/material";
import { BE_URL } from "../utils/constants";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        width={size}
        height={size}
        style={{ objectFit: "cover", borderRadius: "50%" }}
        src={BE_URL + `/assets/${image}`}
        alt="user"
      />
    </Box>
  );
};

export default UserImage;
