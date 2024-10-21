import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 
  40% {
    transform: scale(1);
  }
`;

const LoadingDots = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      className="dots-loading-wrapper"
    >
      <Box
        sx={{
          width: "10px",
          height: "10px",
          margin: "0 5px",
          backgroundColor: "black",
          borderRadius: "50%",
          animation: `${bounce} 1.4s infinite ease-in-out`,
          animationDelay: "0s",
        }}
      />
      <Box
        sx={{
          width: "10px",
          height: "10px",
          margin: "0 5px",
          backgroundColor: "black",
          borderRadius: "50%",
          animation: `${bounce} 1.4s infinite ease-in-out`,
          animationDelay: "0.2s",
        }}
      />
      <Box
        sx={{
          width: "10px",
          height: "10px",
          margin: "0 5px",
          backgroundColor: "black",
          borderRadius: "50%",
          animation: `${bounce} 1.4s infinite ease-in-out`,
          animationDelay: "0.4s",
        }}
      />
    </Box>
  );
};

export default LoadingDots;
